FROM --platform=linux/amd64 openjdk:21
LABEL authors="ropold"
EXPOSE 8080
COPY backend/target/quizhub.jar quizhub.jar
ENTRYPOINT ["java", "-jar", "quizhub.jar"]