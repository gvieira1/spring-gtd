### Implementação da Metodologia GTD em Software de Organização Acadêmica - AcademicGTD

Este é um aplicativo de organização voltado para estudantes, baseado na metodologia **GTD (Getting Things Done)**. O sistema permite o gerenciamento completo de tarefas e projetos, com integração ao ambiente acadêmico **Moodle**, visualização em calendário e geração de relatórios de desempenho.

### 🚀 Tecnologias Utilizadas

#### Backend

- Java
- Spring Boot
- Spring Data JPA
- JWT
- Maven
- Flyway
- MySQL
- Swagger (Documentação de API)
- Docker / Docker Compose
#### Frontend

- jQuery
- Bootstrap
- AJAX
- Toast UI Calendar (visualização de tarefas em calendário)
- Chart.js (relatórios visuais)

#### Integrações

- Moodle (importação e sincronização automática de atividades acadêmicas)

---
### ✅ Funcionalidades Principais

- Autenticação via e-mail e senha
- Opção "Esqueci minha senha"
- Cadastro, edição e exclusão de tarefas
- Visualização estruturada e em calendário
- Filtragem de tarefas por rótulos
- Agrupamento de tarefas por projetos
- Integração com Moodle para importação automática de atividades
- Marcação automática de tarefas concluídas no Moodle
- Notificações para prazos
- Geração de relatórios com dados dos estudos

---

### 📄 [Relatório Técnico completo](docs/Relatorio_Tecnico_ADS_IFSP)

---

### 🛠️ Como Rodar o Projeto Localmente

#### Pré-requisitos
- Git
- Java 21+
- Maven
- Docker e Docker Compose

#### Passos
```bash
# 1. Clone o repositório
git clone https://github.com/gvieira1/spring-gtd.git

# 2. Acesse a pasta gerada
cd spring-gtd

# 3. Compile o projeto e gere o .jar via maven
mvn clean package -DskipTests

# 4. Suba o banco de dados do Moodle
docker compose up -d moodle-db

# 5. Inicie todos os containers (incluindo a aplicação e demais serviços)
docker-compose up

# ⚠️ Aguarde a instalação do Moodle. Esse processo pode levar alguns minutos!

# 6. Acesse https://localhost:8000 e termine a configuração do Moodle.

# 7. Execute o script de importação do banco do Moodle com dados de teste
bash import-moodle-dump.sh

# 8. Tudo pronto! Os serviços ficam disponíveis nas portas 8080 (gtd) e 8000 (moodle)
````

#### Comandos Úteis Docker

| Ação                                               | Comando Docker             |
| -------------------------------------------------- | -------------------------- |
| Ver containers ativos                              | `docker ps`                |
| Ver todos os containers (inclusive parados)        | `docker ps -a`             |
| Ver logs de um container                           | `docker logs <nome_ou_id>` |
| Subir containers definidos no `docker-compose.yml` | `docker compose up`        |
| Parar todos os containers do Compose               | `docker compose stop`      |
| Ver status dos serviços                            | `docker compose ps`        |
| Ver logs de todos os containers do Compose         | `docker compose logs -f`   |

### 📖 Documentação da API

Após iniciar o projeto, você pode acessar a documentação Swagger em:

```
http://localhost:8080/swagger-ui/index.html
```

---
### 📌 Observações

- A primeira execução pode demorar devido à configuração do ambiente Moodle via Docker.
    
- Certifique-se de que as portas padrão (como 8080 para o GTD e 8000 para o moodle) estão livres no seu sistema.
  
    
