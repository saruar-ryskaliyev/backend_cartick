import translate from 'google-translate-api';

const carMakes = [
  "Acura", "AITO", "Alfa Romeo", "Alga", "Alpina", "Arcfox", "Aro", "Aston Martin", "Audi", "Aurus", "Avatr",
  "BAIC", "Bajaj", "Baojun", "BAW", "Bentley", "Blaval", "BMW", "Borgward", "Brilliance", "Bugatti", "Buick", "BYD",
  "Cadillac", "Changan", "ChangFeng", "Changhe", "Chery", "Chevrolet", "Chrysler", "Citroen", "Core Power",
  "Dacia", "Daewoo", "Daihatsu", "Datsun", "Dayun", "Denza", "Derways", "DFSK", "Dodge", "DongFeng", "DS",
  "Eagle", "Enovate", "Evergrande", "EXEED",
  "Fang Cheng Bao", "Farizon", "FAW", "Ferrari", "Fiat", "Fisker", "Ford", "Forthing", "Foton",
  "GAC", "Geely", "Genesis", "GMC", "Gonow", "Great Wall",
  "Hafei", "Haima", "Hanteng", "Haval", "Hawtai", "HiPhi", "Honda", "Hongqi", "Hozon", "HuangHai", "Huansu", "Hummer", "Hyundai",
  "iCar", "IM", "Infiniti", "Iran Khodro", "Isuzu",
  "JAC", "Jaecoo", "Jaguar", "Jeep", "Jetour", "Jetta", "JinBei", "JINPENG", "Jiyue", "JMC",
  "Kaiyi", "Karry", "Kia", "KYC",
  "Lamborghini", "Lancia", "Land Rover", "Leapmotor", "Leopaard", "Lexus", "Li", "Lifan", "Lincoln", "Livan", "Lotus", "Lucid", "Luxeed", "Luxgen", "Lynk & Co",
  "Mahindra", "Maple", "Maserati", "Maxus", "Maybach", "Mazda", "McLaren", "Mercedes-Benz", "Mercedes-Maybach", "Mercury", "Metrocab", "MG", "Mini", "Mitsubishi",
  "Nio", "Nissan", "NL",
  "Oldsmobile", "OMODA", "Opel", "Ora",
  "Peugeot", "Plymouth", "Polar Stone", "Polestar", "Pontiac", "Porsche", "Proton", "Puch",
  "Radar", "Ravon", "Renault", "Renault Samsung", "Rivian", "Roewe", "Rolls-Royce", "Rover",
  "Saab", "SAIC", "Santana", "Saturn", "Scion", "SEAT", "Seres", "ShuangHuan", "Skoda", "Skywell", "Smart", "Sol", "Soueast", "SRM", "SsangYong", "Subaru", "Suzuki", "SWM",
  "Tank", "Tesla", "Tianma", "Tianye", "Toyota",
  "Venucia", "VGV", "VinFast", "Volkswagen", "Volvo", "Vortex", "Voyah",
  "Wanfeng", "Weltmeister", "Wey", "Wuling",
  "Xiaomi", "Xinkai", "Xpeng",
  "Yema",
  "Zeekr", "Zhiji", "Zotye", "ZX",
  "ВАЗ (Lada)", "ВИС", "ГАЗ", "ЕрАЗ", "ЗАЗ", "ЗИЛ", "ИЖ", "ЛуАЗ", "Москвич", "РАФ", "Ретро-автомобили", "СМЗ", "ТагАЗ", "УАЗ"
];

const translateAndMapCarMake = async (input: string): Promise<string | null> => {
  try {
    // Translate the input to English
    const translated = await translate(input, { to: 'en' });
    const translatedText = translated.text.toLowerCase();

    // Find the closest match from the predefined car makes
    const mappedCarMake = carMakes.find(make => make.toLowerCase() === translatedText);

    return mappedCarMake || null;
  } catch (error) {
    console.error('Error translating and mapping car make:', error);
    return null;
  }
};

export { translateAndMapCarMake };
