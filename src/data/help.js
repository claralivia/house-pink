// Aulas do portal de ajuda. `video` é o nome do arquivo no Supabase Storage (opcional):
// as aulas das profissionais ficam no bucket privado `help-pro`, as das clientes em `help-public`.

export const PRO_MODULES = [
  {
    id: 'comecar',
    title: 'Primeiros passos',
    lessons: [
      {
        id: 'entrar',
        title: 'Entrar e conhecer o painel',
        summary: 'Onde ficam as coisas e como sair.',
        steps: [
          'Abra o site da House Pink e toque em “Entrar”, no canto de cima.',
          'Digite o seu e-mail e a sua senha e toque em “Entrar”. O site reconhece que você é profissional e abre a sua agenda.',
          'Você chega na sua agenda. Embaixo da tela ficam cinco abas: Agenda, Clientes, Ganhos, Serviços e Mais.',
          'Para trocar a senha ou sair, toque em “Mais” e depois em “Minha conta”.',
        ],
      },
    ],
  },
  {
    id: 'agenda',
    title: 'Agenda',
    lessons: [
      {
        id: 'ver-agenda',
        title: 'Ver a agenda por dia ou por semana',
        summary: 'Como saber quem vem hoje e como está a semana.',
        video: 'pro-ver-agenda-v3.mp4',
        steps: [
          'Toque em “Agenda”, na barra de baixo.',
          'Em “Dia”, toque no dia que quer ver na faixa de datas. Os dias com horários marcados mostram quantos são.',
          'Em “Semana”, você vê a semana inteira de uma vez, como no Google Agenda. Use as setas para ir para a semana anterior ou para a próxima.',
          'Toque em qualquer horário para abrir os detalhes da cliente.',
        ],
      },
      {
        id: 'atender',
        title: 'Confirmar, concluir e receber',
        summary: 'O caminho de um horário, da marcação ao pagamento.',
        steps: [
          'Toque no horário na agenda. Quando a cliente agenda pelo site, ele aparece como “Ainda não confirmado”.',
          'Toque em “Confirmar horário”. A cliente passa a ver que está confirmado.',
          'Se você cobra sinal e a cliente já pagou, toque em “Cliente pagou o sinal” e escolha Pix, cartão ou dinheiro.',
          'Depois do atendimento, toque em “Atendimento concluído” e escolha como a cliente pagou o restante: Pix, cartão ou dinheiro. Se ainda não pagou, toque em “Ainda não pagou”.',
          'Para avisar a cliente, use “Falar com a cliente no WhatsApp”.',
        ],
      },
      {
        id: 'novo-horario',
        title: 'Marcar um horário para uma cliente',
        summary: 'Para quando a cliente chama pelo WhatsApp.',
        steps: [
          'Na Agenda, toque em “Novo horário”.',
          'Escolha o dia e o serviço. Os horários livres daquele dia aparecem para você tocar.',
          'Digite o nome e o WhatsApp da cliente. Se ela já está na sua lista, o nome é preenchido sozinho.',
          'Toque em “Salvar horário”. Ele já fica confirmado na agenda.',
        ],
      },
      {
        id: 'mudar-horario',
        title: 'Mudar ou cancelar um horário',
        summary: 'Trocar o dia, a hora, o valor ou desmarcar.',
        steps: [
          'Toque no horário na agenda.',
          'Para mudar, toque em “Mudar o horário ou o valor”. Troque o dia, a hora, a duração ou o valor e toque em “Salvar”.',
          'Para desmarcar, toque em “Cancelar este horário” e depois em “Sim, cancelar”.',
          'Depois, avise a cliente pelo WhatsApp.',
          'Marcou algo errado? Em um atendimento concluído, toque em “Desfazer: voltar para confirmado”. Em um cancelado, toque em “Reativar este horário”.',
          'Se cadastrou o horário por engano, toque em “Apagar este registro” e depois em “Sim, apagar”. Ele some da agenda e dos ganhos, e não dá para voltar atrás.',
        ],
      },
    ],
  },
  {
    id: 'clientes',
    title: 'Clientes',
    lessons: [
      {
        id: 'cadastrar',
        title: 'Cadastrar uma cliente',
        summary: 'Ter a sua lista de clientes sempre à mão.',
        steps: [
          'Toque em “Clientes”, na barra de baixo.',
          'Toque em “Cadastrar cliente”.',
          'Digite o nome e o WhatsApp com DDD e toque em salvar.',
          'Para achar alguém depois, escreva o nome ou o número em “Procurar cliente”.',
          'Cadastrou uma cliente por engano? Toque no nome dela e em “Tirar da minha lista”. Se ela já tiver horários com você, o app avisa quantos são e só apaga tudo se você confirmar de novo.',
        ],
      },
      {
        id: 'importar',
        title: 'Importar clientes de uma planilha',
        summary: 'Trazer de uma vez a lista que você já tem.',
        steps: [
          'Abra a sua planilha (Excel ou Google Planilhas) e deixe só duas colunas: nome e WhatsApp.',
          'Selecione as duas colunas e copie.',
          'No app, toque em “Clientes” e depois em “Importar da planilha”.',
          'Cole no campo de texto. O app mostra quantas clientes encontrou e avisa se alguma linha está com problema.',
          'Toque em “Importar”. Quem já estava na lista é ignorada, sem repetir.',
        ],
      },
      {
        id: 'agendar-para-cliente',
        title: 'Agendar direto para uma cliente da lista',
        summary: 'Dois toques e o horário está marcado.',
        steps: [
          'Em “Clientes”, toque no nome da cliente.',
          'Toque em “Agendar horário para” e o nome dela.',
          'Escolha o serviço, o dia e o horário e toque em “Salvar horário”.',
          'Se o nome ou o número estiver errado, toque em “Corrigir nome ou WhatsApp”.',
        ],
      },
    ],
  },
  {
    id: 'ganhos',
    title: 'Ganhos',
    lessons: [
      {
        id: 'ver-ganhos',
        title: 'Ver quanto você recebeu',
        summary: 'Só você vê. Separado por forma de pagamento.',
        steps: [
          'Toque em “Ganhos”, na barra de baixo.',
          'Escolha o período: Dia, Semana ou Mês. Use as setas para ver períodos anteriores.',
          'Veja o total recebido e quanto veio de Pix, cartão e dinheiro. O sinal entra separado do restante.',
          'Para guardar ou mandar o fechamento, toque em “Copiar resumo” e cole onde quiser.',
          'Os seus ganhos são privados: nem a outra profissional vê.',
        ],
      },
    ],
  },
  {
    id: 'servicos',
    title: 'Serviços e perfil',
    lessons: [
      {
        id: 'editar-servicos',
        title: 'Editar serviços, valores e fotos',
        summary: 'Mudar preço, duração, descrição e foto.',
        steps: [
          'Toque em “Serviços”, na barra de baixo.',
          'Toque em “Editar” no serviço que quer mudar.',
          'Mude o nome, a duração em minutos, o valor e a descrição que a cliente vai ler.',
          'Para a foto, toque em “Adicionar foto” ou “Trocar foto” e escolha uma imagem do celular.',
          'Toque em “Salvar”. A mudança já vale para os próximos agendamentos.',
          'Para criar um serviço novo, use “Adicionar tipo”, no fim da lista do serviço.',
          'Para apagar um serviço cadastrado errado, toque em “Excluir este serviço”. Se ele já tem horários na agenda, o app avisa e você só desmarca “Disponível para agendar” para ele sumir do site.',
        ],
      },
      {
        id: 'meu-perfil',
        title: 'Editar o meu perfil do site',
        summary: 'A sua foto e a sua apresentação.',
        steps: [
          'Toque em “Mais” e depois em “Meu perfil”.',
          'Toque em “Trocar a minha foto” e escolha uma imagem.',
          'Escreva a sua apresentação e o seu Instagram.',
          'Toque em “Salvar perfil”. A foto e o texto mudam na página inicial do site e na conta das clientes.',
        ],
      },
    ],
  },
  {
    id: 'ajustes',
    title: 'Ajustes da agenda',
    lessons: [
      {
        id: 'ajustes-agenda',
        title: 'Horário de atendimento, folgas e dias à frente',
        summary: 'Você manda na sua agenda.',
        steps: [
          'Toque em “Mais” e depois em “Ajustes da agenda”.',
          'Em “Horário de atendimento”, ligue os dias em que atende e defina o começo e o fim de cada um.',
          'Em “Quantos dias à frente a cliente pode agendar”, escolha o prazo. Depois dele, a cliente chama você pelo WhatsApp.',
          'Em “Folgas e férias”, marque os dias em que não atende. Eles somem da agenda do site. Horários já marcados continuam na sua agenda para você remarcar.',
          'Lembre de tocar em salvar em cada parte que mudar.',
        ],
      },
      {
        id: 'sinal-regras',
        title: 'Sinal e regras de atendimento',
        summary: 'O que a cliente lê antes de confirmar.',
        steps: [
          'Em “Mais”, toque em “Ajustes da agenda”.',
          'Em “Sinal”, digite o valor que a cliente paga para garantir o horário. Deixe vazio se você não cobra sinal.',
          'Em “Regras que a cliente vê ao agendar”, escreva uma regra por linha, por exemplo sobre atrasos e remarcações.',
          'Toque em salvar. As regras aparecem para a cliente antes de confirmar o horário.',
        ],
      },
      {
        id: 'avaliacoes',
        title: 'Ver as avaliações das clientes',
        summary: 'Notas e comentários dos atendimentos.',
        steps: [
          'Toque em “Mais” e depois em “Avaliações das clientes”.',
          'Veja a sua nota média e os comentários que as clientes deixaram depois do atendimento.',
        ],
      },
    ],
  },
]

export const CLIENT_MODULES = [
  {
    id: 'conta',
    title: 'Sua conta',
    lessons: [
      {
        id: 'criar-conta',
        title: 'Criar a sua conta',
        summary: 'Para ver os valores e acompanhar os seus horários.',
        steps: [
          'Toque em “Entrar”, no canto de cima do site.',
          'Toque em “Criar conta”.',
          'Digite o seu nome, o WhatsApp com DDD, o seu e-mail e escolha uma senha.',
          'Toque em “Criar conta”. Pode ser que a gente peça para você confirmar o e-mail: abra a mensagem que chegou e toque no link.',
        ],
      },
      {
        id: 'entrar',
        title: 'Entrar na sua conta',
        summary: 'E o que fazer se esquecer a senha.',
        steps: [
          'Toque em “Entrar”, no canto de cima do site.',
          'Digite o seu e-mail e a sua senha e toque em “Entrar”.',
          'Esqueceu a senha? Toque em “Esqueci a senha”, digite o seu e-mail e toque em “Enviar link”. Abra o e-mail e escolha uma senha nova.',
        ],
      },
      {
        id: 'foto',
        title: 'Colocar a sua foto e editar os seus dados',
        summary: 'A profissional vê a foto e sabe quem é você.',
        steps: [
          'Entre na sua conta e toque em “Perfil”, na barra de baixo.',
          'Toque em “Adicionar a minha foto” e escolha uma imagem do celular.',
          'Para mudar o nome ou o WhatsApp, mude nos campos e toque em “Salvar alterações”.',
        ],
      },
    ],
  },
  {
    id: 'agendar',
    title: 'Agendar',
    lessons: [
      {
        id: 'agendar-sem-conta',
        title: 'Agendar sem criar conta',
        summary: 'Só o seu nome e o seu WhatsApp.',
        steps: [
          'Toque em “Agendar” no site.',
          'Na pergunta “Como você quer continuar?”, escolha “Sou visitante”.',
          'Escolha o serviço que você quer e o dia. Os horários livres aparecem para você tocar.',
          'Digite o seu nome e o seu WhatsApp e toque em “Confirmar horário”.',
          'Pronto: o horário fica reservado. A profissional confirma com você pelo WhatsApp, porque alguns serviços dependem de sinal.',
          'Sem conta, os valores não aparecem. Criar uma conta é recomendado.',
        ],
      },
      {
        id: 'agendar-com-conta',
        title: 'Agendar com a sua conta',
        summary: 'Você vê os valores e acompanha tudo.',
        steps: [
          'Entre na sua conta e toque em “Agendar um horário”. Se estiver no site, toque em “Agendar” e escolha “Sou cliente”.',
          'Escolha o serviço. Agora os valores aparecem.',
          'Escolha o dia e o horário e toque em “Confirmar horário”.',
          'Se você já fez um serviço antes, o botão “Agendar de novo” já deixa tudo escolhido.',
        ],
      },
    ],
  },
  {
    id: 'horarios',
    title: 'Seus horários',
    lessons: [
      {
        id: 'ver-cancelar',
        title: 'Ver ou cancelar o seu horário',
        summary: 'Está tudo na tela inicial da sua conta.',
        steps: [
          'Entre na sua conta. O seu próximo horário aparece em destaque, com o dia, a hora e a profissional.',
          'O aviso mostra se já está confirmado ou se a profissional ainda vai confirmar.',
          'Para cancelar, toque em “Cancelar este horário” e depois em “Sim, cancelar”.',
          'Para conversar com a profissional, toque em “Falar no WhatsApp”.',
          'Para ler as regras de atendimento, toque em “Ver regras de atendimento”.',
        ],
      },
      {
        id: 'avaliar',
        title: 'Dar a sua opinião',
        summary: 'Depois do atendimento, conte como foi.',
        steps: [
          'Depois do atendimento, entre na sua conta.',
          'Na tela inicial, toque em “Dar a minha opinião”.',
          'Escolha de 1 a 5 estrelas e, se quiser, escreva um comentário.',
          'Toque em “Enviar avaliação”. Só você e a profissional veem a avaliação.',
        ],
      },
    ],
  },
]

export const HELP_MODULES = { pro: PRO_MODULES, client: CLIENT_MODULES }
