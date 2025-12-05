# Arquitetura do Projeto CRM Supabase

## Visão Geral

Este projeto implementa um sistema CRM com interface Kanban usando Next.js, TypeScript e Supabase como banco de dados. A arquitetura segue princípios de separação de responsabilidades, garantindo que o frontend não tenha acesso direto ao banco de dados.

## Estrutura de Camadas

### 1. Frontend (React/Next.js)
**Localização**: `app/`
- **Responsabilidades**:
  - Interface do usuário (UI/UX)
  - Gerenciamento de estado local
  - Chamadas HTTP para as APIs
- **Restrições**:
  - NÃO deve importar ou usar o cliente Supabase diretamente
  - Todas as operações devem passar pelas rotas `/api/*`
  - Usa apenas `fetch()` para comunicação

### 2. API Routes (Next.js API Routes)
**Localização**: `app/api/`
- **Responsabilidades**:
  - Receber requisições HTTP do frontend
  - Validar entrada de dados
  - Autenticação e autorização
  - Delegar operações para os serviços
  - Retornar respostas padronizadas
- **Estrutura**:
  - `customers/` - CRUD de clientes
  - `tickets/` - CRUD de tickets
  - `kanban-columns/` - Gerenciamento de colunas Kanban

### 3. Services Layer (Camada de Serviços)
**Localização**: `app/services/`
- **Responsabilidades**:
  - Lógica de negócio
  - Operações CRUD no banco de dados
  - Tratamento de erros específicos do domínio
  - Composição de queries complexas
- **Serviços Disponíveis**:
  - `CustomerService` - Operações com clientes
  - `TicketService` - Operações com tickets
  - `KanbanColumnService` - Operações com colunas Kanban
  - `TicketEventService` - Eventos de tickets
  - `TicketMessageService` - Mensagens de tickets

### 4. Database Layer (Supabase)
**Localização**: `lib/supabase.ts`
- **Responsabilidades**:
  - Configuração da conexão com Supabase
  - Cliente único para acesso ao banco
- **Restrições**:
  - Só deve ser usado pelos serviços
  - Nunca exposto ao frontend

## Fluxo de Dados

```
Frontend (React Components)
    ↓ HTTP Request (fetch)
API Routes (/api/*)
    ↓ Service Call
Services (CustomerService, etc.)
    ↓ Database Query
Supabase Database
    ↑ Query Result
Services
    ↑ Formatted Data
API Routes
    ↑ JSON Response
Frontend
```

## Princípios de Segurança

1. **Sem Acesso Direto**: O frontend nunca acessa o banco diretamente
2. **Validação em Camada**: Validação de entrada em todas as APIs
3. **Tratamento de Erros**: Erros não expõem detalhes internos
4. **Autenticação**: Controle de acesso baseado em sessão/token

## Boas Práticas

- **Separação de Responsabilidades**: Cada camada tem uma função clara
- **Tipagem Forte**: Uso consistente de TypeScript
- **Tratamento de Erros**: Padronização no tratamento de erros
- **Documentação**: Código bem documentado em português brasileiro
- **Convenções de Nome**: Inglês para código, português para documentação

## Dependências Principais

- **Next.js**: Framework React com SSR
- **TypeScript**: Tipagem estática
- **Supabase**: Banco de dados e autenticação
- **Tailwind CSS**: Estilização
- **@dnd-kit**: Drag and drop para Kanban

## Desenvolvimento

Para manter a arquitetura saudável:

1. Sempre use os serviços para operações no banco
2. Nunca importe `supabase` no frontend
3. Valide entrada de dados nas APIs
4. Mantenha tratamento de erros consistente
5. Documente mudanças na arquitetura