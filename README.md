## Agregado Cliente

Entidade Raiz: Cliente
Atributos essenciais: ID, nome, contato, histórico de serviços

Responsabilidades:

- Solicitar serviços
- Avaliar serviços
- Compartilhar serviços
- Depositar depoimentos
- Visualizar status de serviços

## Agregado Serviço

Entidade Raiz: Serviço
Entidades relacionadas: Planos, Detalhes do Serviço
Value Objects: Status do Serviço, Avaliação

Responsabilidades:

- Manter status atualizado
- Gerenciar certificações
- Controlar solicitações
- Registrar avaliações
- Manter histórico de atualizações

## Agregado Manager

Entidade Raiz: Manager
Entidades relacionadas: Departamento

Responsabilidades:

- Gerenciar serviços
- Administrar outros managers
- Responder depoimentos
- Gerenciar solicitações

## Casos de Uso

### Gestão de Serviços

Criar Serviço:

- Atualizar Serviço
- Certificar Serviço
- Alterar Informações do Serviço
- Cadastrar Serviço

### Gestão de Solicitações

Criar Solicitação:

- Aceitar Solicitação
- Rejeitar Solicitação
- Processar Solicitação

### Interação com Cliente

Registrar Depoimento:

- Responder Depoimento
- Registrar Avaliação
- Compartilhar Serviço

### Gestão de Managers

Cadastrar Manager:

- Atribuir Serviço a Manager
- Gerenciar Equipe de Serviço

## Regras de Negócio

### Serviços

Um serviço deve ter pelo menos um manager responsável
Serviços precisam ser certificados antes de ficarem disponíveis
Cada serviço deve pertencer a um departamento
Serviços podem ter múltiplos planos associados

Solicitações

Toda solicitação deve ser respondida em um prazo máximo

### Solicitações rejeitadas devem ter justificativa

Cliente deve ser notificado sobre mudanças de status

### Avaliações e Depoimentos

Apenas clientes que utilizaram o serviço podem avaliar
Depoimentos precisam ser moderados antes de publicação
Managers devem responder depoimentos em tempo hábil

### Managers

Um manager pode pertencer a múltiplos departamentos
Apenas managers podem certificar serviços
Managers podem colaborar em equipes para serviços específicos

### Eventos de Domínio

Serviços

ServiçoCriado

- ServiçoAtualizado
- ServiçoCertificado
- ServiçoCompartilhado

Clientes

DepoimentoRegistrado

- AvaliaçãoRealizada
- SolicitaçãoCriada

Managers

ManagerCadastrado

- EquipeFormada
- DepoimentoRespondido

## Value Objects Identificados

Avaliação

Pontuação
Comentário
Data

Status de Serviço

Pendente
Em Análise
Certificado
Disponível
Indisponível

Depoimento

Conteúdo
Data
Status (pendente, aprovado, rejeitado)

Políticas de Acesso:

Cliente

Pode visualizar serviços disponíveis
Pode solicitar serviços
Pode avaliar serviços utilizados
Pode compartilhar serviços

Manager

Pode gerenciar serviços de seus departamentos
Pode certificar serviços
Pode responder depoimentos
Pode formar equipes
