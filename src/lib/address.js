export const addressLines = ({ street, district, city, state, cep }, hours) => [
  street,
  `${district}, ${city}, ${state}`,
  `CEP ${cep}`,
  hours,
]
