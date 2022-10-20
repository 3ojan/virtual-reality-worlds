export const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const countDays = (date1, date2) => {
  let difference = date1.getTime() - date2.getTime();
  console.log(Math.ceil(difference / (1000 * 3600 * 24)))
  return Math.ceil(difference / (1000 * 3600 * 24));
}