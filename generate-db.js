const fs = require("fs");

const brands = [
  "cosrx","anua","beauty of joseon","cerave","la roche-posay",
  "innisfree","round lab","skin1004","some by mi","the ordinary",
  "klairs","isntree","missha","dr jart","laneige",
  "aplb","bio-oil","ksecret","medicube","tocobo",
  "panoxyl","purito","skintegra","celimax","dermina",
  "dr althea","jumiso","geek and gorgeous","novaclear","evy technology",
  "haruharu wonder","barulab","arencia","biodance","abib","bee factor"
];

const types = [
  "cleanser","serum","toner","cream","sunscreen",
  "mask","essence","oil","moisturizer"
];

let products = [];
let id = 1;

for (let i = 0; i < 500; i++) {
  const brand = brands[i % brands.length];
  const type = types[i % types.length];

  products.push({
    id: id++,
    name: `${brand.toUpperCase()} ${type} ${i + 1}`,
    brand: brand,
    type: type,
    price: Number((10 + Math.random() * 30).toFixed(2)),
    image: `https://source.unsplash.com/600x600/?skincare,cosmetics,${brand}`,
    desc: `High quality ${type} from ${brand}`
  });
}

const db = { products };

fs.writeFileSync("db.json", JSON.stringify(db, null, 2));

console.log("500 products generated successfully!");