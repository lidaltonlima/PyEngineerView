# Components

- Tirar os componentes "forces" e "moments" de dentro das reactions e loads e transformá-los em
  componentes independentes genéricos colocando um "Text" na frente do nome, ficando, por
  exemplo, LineArrowText.

# Refactor

- Mudar a ordem em que os tipos aparecem no Structure para corresponder ao python e ficar mais
  fácil de procurar quando preciso. O Python não permite que a interface seja usada antes de
  ser declarada
