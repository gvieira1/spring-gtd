FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY target/gtd-spring-0.0.1-SNAPSHOT.jar gtd.jar
ENTRYPOINT ["java", "-jar", "gtd.jar"]
