export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
}

// Placeholder images using UI Avatars as colored placeholders
// In production these would be real product images
const placeholder = (label: string, bg: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(label)}&background=${bg}&color=fff&size=200&font-size=0.25`;

export const products: Product[] = [
  {
    id: '1',
    name: 'Sour Patch Kids Easter Jelly Beans',
    price: 3.50,
    category: 'Candy & Snacks',
    image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQNuISKGAGSxU5kAy2Bmuz0fb-MOPAj0P1h1tNINUehOYryH1ga4vAnjSMmlaUReXT1-z5BtuH6v5l1mhBdd26sDjTSwfusYUEu3RANSBWEZD8iiRf5KzWFPg&usqp=CAc',
    stockStatus: 'in_stock',
  },
  {
    id: '2',
    name: 'Easter Gingham Basket',
    price: 5.00,
    category: 'Easter',
    image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTChegziBPuXiaVIHZumwTbjM8C_mQJaKUE5iWhrsXbB4s-JBWjjAUFPb-9vbVMO3WpllKcoAIBplCmF5MfFuMzFsx9AdJAvqiDhZ9r1gYOZnT8OpdQCqK7',
    stockStatus: 'in_stock',
  },
  {
    id: '3',
    name: 'Disney Stitch Chalk Set 3-Pack',
    price: 1.00,
    category: 'Toys & Games',
    image: 'https://fbres.fivebelow.com/image/upload/product/9227278_01.jpg',
    stockStatus: 'in_stock',
  },
  {
    id: '4',
    name: 'Eva Tote Bag 18in X 8.8in',
    price: 15.00,
    category: 'Style',
    image: 'https://i5.walmartimages.com/seo/MS-FLEX-TOTE-PALE-BLUE_47860890-3e12-4b0f-97fb-fdd74e191cbe.cd990f1854c6c7819efb2243a3f14423.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF',
    stockStatus: 'in_stock',
  },
  {
    id: '5',
    name: 'Mystery Squishy Dumpling',
    price: 10.00,
    category: 'Toys & Games',
    image: 'https://i.ebayimg.com/images/g/CrgAAeSwqjNpqogJ/s-l500.jpg',
    stockStatus: 'out_of_stock',
  },
  {
    id: '6',
    name: 'Mystery Pop! Keychains K-Pop',
    price: 5.00,
    category: 'Toys & Games',
    image: placeholder('Pop Keychain', '805ad5'),
    stockStatus: 'in_stock',
  },
  {
    id: '7',
    name: 'Winnie the Pooh Plush 12in',
    price: 5.00,
    category: 'Toys & Games',
    image: placeholder('Pooh Plush', 'ecc94b'),
    stockStatus: 'low_stock',
  },
  {
    id: '8',
    name: 'LED Bluetooth Headphones',
    price: 5.00,
    category: 'Tech',
    image: placeholder('Headphones', '4a5568'),
    stockStatus: 'in_stock',
  },
  {
    id: '9',
    name: 'Strawberry Crochet Basket',
    price: 5.00,
    category: 'Room',
    image: placeholder('Crochet Basket', 'e53e3e'),
    stockStatus: 'in_stock',
  },
  {
    id: '10',
    name: 'Hello Kitty Squishy Toy',
    price: 5.00,
    category: 'Toys & Games',
    image: placeholder('Hello Kitty', 'fc8181'),
    stockStatus: 'in_stock',
  },
];

export const categories = [
  'Easter',
  'New & Now',
  'Room',
  'Toys & Games',
  'Tech',
  'Beauty',
  'Style',
  'Arts & Crafts',
  'Candy & Snacks',
  'Pet Supplies',
  'Sports',
  'Books',
];
