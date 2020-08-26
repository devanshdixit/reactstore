const stripe = require("stripe")("sk_test_anbJMBykNWwp9ssZHR6vM9N600bWUORpfZ");
const uuid = require("uuid/v4");



exports.makepayment = (req, res) => {
  const { products, token } = req.body;

  let amount = 0;
  products.map(p => {
    amount = amount + p.price;
  });
  const idempotencyKey = uuid();
  return stripe.customers
    .create({
      email: token.email,
    })
    .then(customer => {
     stripe.charges
        .create(
          {
            amount: 100,
            currency: "usd",
            source: token.id,
            receipt_email: token.email,
            description: `Purchased the product`,
            shipping: {
              name: token.card.name,
              address: {
                line1: token.card.address_line1,
                line2: token.card.address_line2,
                city: token.card.address_city,
                country: token.card.address_country,
                postal_code: token.card.address_zip
              }
            }
            },
          {
            idempotencyKey
          }
        )
        .then(result => res.status(200).json(result),
        console.log("PAMENT SUCCESS"))
        .catch(err => console.log("Failed",err));
    })
    .catch(console.log("FAILED"));
};
