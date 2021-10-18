# azure-workshop
Skyskolen azure workshop 🚀

## Prerequisites:

-   azure-cli
    -   ```brew update && brew install azure-cli```
-   Docker
    -   https://docs.docker.com/desktop/mac/install/
-   Java
    -    ```brew search adoptopenjdk```
    -    Velg java 11 eller høyere -> ```brew install adoptopenjdk11```
-   Maven
    -   ```brew install maven```  
-   Node

## Sett opp azure

1.   Sjekk at du kan logge inn på https://portal.azure.com med bekk mailen din, 2FA er påkrevd så du må godkjenne i authenticator appen
2.   Lag en resource group i terminalen : <br/>(A resource group is a logical collection into which all Azure resources are deployed and managed)<br/>```az group create --name myResourceGroup --location westeurope```
3.   Lag en container registry : <br/> azure Container Registry allows you to build, store, and manage container images and artifacts in a private registry for all types of container deployments. <br/>```az acr create --resource-group myResourceGroup --name <acrName> --sku Basic``` Du velger selv hva `acrName` skal være men den må være unik, prøv en kombo av `ditt navn + skyskolen`. Noter deg ditt `acrName` du kommer til å trenge det senere
4.   ```az acr update -n <acrName> --admin-enabled true``` enable the admin user for an existing registry
<br />

## Oppgave 1) <br/>
### Deploy av backend
1. Lag en `Dockerfile` fil i roten av `spring-boot-backend` mappen og lim inn følgende : <br/> 
```
FROM maven:latest AS build  
COPY src /usr/src/app/src  
COPY pom.xml /usr/src/app
WORKDIR /usr/src/app  
RUN mvn clean install

FROM adoptopenjdk/openjdk11:alpine-jre
COPY --from=build /usr/src/app/target/spring-boot-backend-0.0.1-SNAPSHOT.jar /usr/app/spring-boot-backend-0.0.1-SNAPSHOT.jar 
ENTRYPOINT ["java","-jar","/usr/app/spring-boot-backend-0.0.1-SNAPSHOT.jar"]
```
2. Bygg dockerfilen du nettopp lagde -> ```docker build -t [imageName] .``` imageName kan for eks være `spring-app`, du velger selv hva det skal være
3. Sjekk at det ble opprettet et docker image -> ```docker images```
4. Kjør imaget med ```docker run -d --rm -p 8989:8989 [imageName]``` her eksponerer vi porten `8989` utenfor containeren
5. Test at applikasjonen kjører, send et request til endepunktet som du finner i `AzureApplicationController` klassen
6. Tag imaget : ```docker tag [imageName] [acrName].azurecr.io/[imageName]``` -> Sjekk at taggen ble opprettet : ```docker images```
7. Push taggen til azure : ```docker push [tagName]``` Hvis du blir spurt om å logge inn kjør : <br/>```az acr login --name [acrName]```
8. Lag en container instance, til det trenger vi dine azure container registry credentials
9. ```az acr credential show --name <acrName>```
10. ```az container create --resource-group myResourceGroup --name spring-app --image tagName --dns-name-label spring-app --ports 8989``` du velger selv hva ```--dns-name-label``` skal være, her er den satt til `spring-app`
11. Du kan nå teste at deployen gikk ok ved å sende et request til http://[dns-name-label].westeurope.azurecontainer.io:8989/azure-service/greeting
<br />

## Oppgave 2) <br/> 
### Lag en Dockerfil for react appen og test kontaineren lokalt
1. Lag en `Dockerfile` fil i roten av `react-client` mappen og lim inn : <br/> 

```
FROM node:14-alpine AS builder
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM nginx:1.19-alpine AS server
COPY ./etc/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder ./app/build /usr/share/nginx/html
```
2. Prøv deg frem og lag en GET request som henter responsen fra backend servicen og viser det i react appen, du kan se hvilken ip og port backend servicen kjører på ved å kjøre ```az container show --resource-group myResourceGroup --name spring-app --query "{ipAddress:ipAddress.ip,Port:ipAddress.ports[0].port}" --out table```
3. Bygg `Dockerfilen` på samme måte som du gjorde med backend, bare pass på å kalle imaget noe annet, for eks ```docker build -t react-app .```
4. Kjør kontaineren og test at appen funker
<br/>

## Oppgave 3) <br/>
### Deploy frontend appen til azure

1.  Du kan nå følge samme prosedyre som da vi deployet backend, bare pass på å erstatte `spring-app` med for eks `react-app` eller hva du enn velger å kalle appen, husk å teste kontaineren lokalt før du deployer til azure

