const { cheltuiala, categorieCheltuiala, buget } = require("../models");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

const praguri = {
  alimente: 60,
  calatorii: 40,
  casa: 30,
  imbracaminte: 30,
  sanatate: 30,
  transport: 20,
  divertisment: 25,
  cadouri: 20,
};


const sfaturiMap = {
  alimente: [
    "Conform comportamentului tău financiar, categoria cu cea mai mare pondere este cea **alimentară**.",
    "Când cheltuielile pe alimente depășesc **60%** din total, este un semnal de **alarmă** financiar.",
    "*Cauze posibile*: cumpărături frecvente, risipă alimentară, lipsa unui plan de mese.",
    "*Recomandare*: planifică mesele săptămânal și mergi la cumpărături cu o listă bine stabilită.",
  ],
  calatorii: [
    "Cheltuielile pe **călătorii** reprezintă o parte considerabilă din bugetul tău.",
    "Când cheltuielile pe călătorii depășesc *40%* din total, poate fi un semn că sunt planificate impulsiv sau prea frecvent.",
    "Analizează dacă toate călătoriile sunt necesare sau pot fi **reduse**.",
    "Folosește oferte, planifică din timp și explorează alternative locale pentru relaxare.",
  ],
  casa: [
    "Cheltuielile pentru **casă** ocupă un procent semnificativ din bugetul tău.",
    "Depășirea pragului de **30%** pe această categorie poate indica lucrări de întreținere sau achiziții mari.",
    "*Recomandare*: stabilește un buget lunar separat pentru reparații și urmărește cheltuielile pe termen lung.",
    "Evită achizițiile neprevăzute și prioritizează investițiile utile în confort și eficiență energetică.",
  ],
  imbracaminte: [
    "Cheltuielile pe **îmbrăcăminte** sunt mai mari decât ar trebui.",
    "Când depășesc **30%** din total, este un semnal de alarmă.",
    "*Recomandare*: stabilește un buget lunar pentru îmbrăcăminte și cumpără doar ce ai nevoie.",
    "Caută reduceri, second-hand sau schimburi de haine cu prietenii. Astfel, poți economisi și să reduci risipa.🌎",
  ],
  sanatate: [
    "Cheltuielile pe **sănătate** sunt esențiale, dar trebuie gestionate cu atenție.",
    "Dacă depășesc **30%** din total, poate fi un semnal că ai cheltuieli medicale neprevăzute sau costuri ridicate cu medicamentele.",
    "*Recomandare*: verifică dacă ai asigurare medicală adecvată și explorează opțiuni de prevenție pentru a reduce cheltuielile pe termen lung.",
    "Planifică vizitele la medic și investește în un stil de viață sănătos pentru a preveni problemele de sănătate.",
  ],
  transport: [
    "Cheltuielile pe **transport** sunt mai mari decât ar trebui.",
    "Când depășesc **20%** din total, este un semnal de alarmă.",
    "*Recomandare*: analizează dacă folosești transportul în comun, bicicleta sau mașina personală în mod eficient.",
    "Astfel de alternative pot reduce costurile și impactul asupra mediului.🌎",
  ],  
  divertisment: [
  "Cheltuiești mult pe **divertisment**. Este important să te relaxezi și să te simți bine, dar totul este bun cu măsură.",
  "Setează un buget lunar clar pentru activități recreative.",
  "*Recomandare*: caută alternative gratuite sau mai ieftine.",
  "De exemplu, plimbări în natură, seri de jocuri cu prietenii sau filme acasă.",
],
  cadouri: [
    "Cheltuielile pe **cadouri** sunt mai mari decât ar trebui.",
    "Când depășesc **20%** din total, este un semnal de alarmă.",
    "*Recomandare*: stabilește un buget anual pentru cadouri și încearcă să îl respecți.",
    "Cumpără cadouri din timp sau fă-ți timp să creezi ceva personalizat.",
    "Amintă-ți că gestul contează mai mult decât valoarea materială a cadoului.♥️",
  ],
};


// const genereazaSfaturi = async (req, res) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "Token lipsă sau invalid." });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || "cheie-secreta");
//     const utilizatorId = decoded.id;

//     const cheltuieli = await cheltuiala.findAll({
//       where: { utilizator_id: utilizatorId },
//       include: { model: categorieCheltuiala,as: 'categorie_cheltuiala',attributes: ['denumire']}
//     });

//     const sfaturi = [];
//     const total = cheltuieli.reduce((acc, c) => acc + c.suma, 0);
//     const categorii = {};

//     // cheltuieli.forEach(c => {
//     // const cat = c.categorie_cheltuiala?.denumire?.toLowerCase();
//     // if (!cat) return;
//     //   if (!categorii[cat]) categorii[cat] = 0;
//     //   categorii[cat] += c.suma;
//     // });

//     cheltuieli.forEach(c => {
//       let cat = c.categorie_cheltuiala?.denumire?.toLowerCase().trim();
//       if (!cat) return;
//       if (!categorii[cat]) categorii[cat] = 0;
//       categorii[cat] += c.suma;
//     });


//     if (total === 0) {
//       return res.json({
//         sfaturi: [
//           "Momentan nu ai cheltuieli înregistrate, deci nu putem genera recomandări personalizate.",
//         ],
//       });
//     }

//     // Regula 1: procent categorie
// //    for (const categorie of Object.keys(categorii)) {
// //         const procent = (categorii[categorie] / total) * 100;
// //         if (praguri[categorie] && procent >= praguri[categorie]) {
// //             sfaturi.push(...(sfaturiMap[categorie] || []));
// //         }
// //     }

//     Object.entries(categorii).forEach(([categorie, suma]) => {
//     const procent = (suma / total) * 100;
//     if (praguri[categorie] && procent >= praguri[categorie]) {
//         console.log("Prag atins:", categorie);
//         console.log("cu procent:", procent);
//         sfaturi.push(...(sfaturiMap[categorie] || []));
//     } else {
//         console.log("Prag NEATINS:", categorie);
//         console.log("cu procent:", procent);
//     }

//     }); 

//     // Regula 2: tranzacții frecvente
//     if (cheltuieli.length > 25) {
//       sfaturi.push("Ai un număr mare de tranzacții. Încearcă să reduci cumpărăturile impulsive.");
//     }

//     // Regula 3: depășire buget
//     const bugete = await buget.findAll({ where: { utilizator_id: utilizatorId } });

//     for (const buget of bugete) {
//       const cheltuieliInPerioada = cheltuieli.filter(c => {
//         const d = new Date(c.data);
//         return d >= buget.data_inceput && d <= buget.data_sfarsit;
//       });

//       const suma = cheltuieliInPerioada.reduce((acc, c) => acc + c.suma, 0);

//       if (suma > buget.suma_maxima) {
//         sfaturi.push(`Ai **depășit** bugetul "${buget.titlu}". Revizuiește cheltuielile din perioada respectivă.`);
//       }
//     }

//     // Regula 4: creștere față de luna trecută
//     const azi = new Date();
//     const lunaCurenta = azi.getMonth();
//     const lunaTrecuta = lunaCurenta === 0 ? 11 : lunaCurenta - 1;

//     const cheltLunaCurenta = cheltuieli.filter(c => new Date(c.data).getMonth() === lunaCurenta);
//     const cheltLunaTrecuta = cheltuieli.filter(c => new Date(c.data).getMonth() === lunaTrecuta);

//     const totalCurent = cheltLunaCurenta.reduce((acc, c) => acc + c.suma, 0);
//     const totalTrecut = cheltLunaTrecuta.reduce((acc, c) => acc + c.suma, 0);

//     if (totalCurent > totalTrecut) {
//       sfaturi.push("Cheltuielile tale au **crescut** față de luna trecută. Analizează dacă este justificat.");
//     }

//     if (sfaturi.length === 0) {
//         sfaturi.push("**Felicitări!!!** Cheltuielile tale sunt echilibrate. Continuă să monitorizezi și să planifici bugetul.");
//         sfaturi.push("Nu uita să verifici secțiunea de recompense!");

//     }
    

//     res.json({ sfaturi });

//   } catch (error) {
//   console.error("Eroare la generarea sfaturilor:", error);  // DEJA EXISTENT
//   res.status(500).json({
//     message: "Eroare internă",
//     eroare: error.message,
//     stack: error.stack  // ca sa vad linia unde crapa
//   });
// }
// };

const genereazaSfaturi = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token lipsă sau invalid." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "cheie-secreta");
    const utilizatorId = decoded.id;

    const cheltuieli = await cheltuiala.findAll({
      where: { utilizator_id: utilizatorId },
      include: {
        model: categorieCheltuiala,
        as: 'categorie_cheltuiala',
        attributes: ['denumire']
      }
    });

    const sfaturi = [];

    // calculează cheltuielile din ultima lună
    const azi = new Date();
    const dataCu30ZileInUrma = new Date();
    dataCu30ZileInUrma.setDate(azi.getDate() - 30);

    const cheltuieliLuna = cheltuieli.filter(c => new Date(c.data) >= dataCu30ZileInUrma);

    const total = cheltuieliLuna.reduce((acc, c) => acc + Number(c.suma), 0);
    const categorii = {};

    cheltuieliLuna.forEach(c => {
      let cat = c.categorie_cheltuiala?.denumire?.toLowerCase().trim();
      if (!cat) return;
      if (!categorii[cat]) categorii[cat] = 0;
      categorii[cat] += Number(c.suma);
    });

    if (total === 0) {
      return res.json({
        sfaturi: [
          "Momentan nu ai cheltuieli înregistrate în ultima lună, deci nu putem genera recomandări personalizate.",
        ],
      });
    }

    // 🔽 Regula 1: procent categorie pe ultima lună
    Object.entries(categorii).forEach(([categorie, suma]) => {
      const procent = (suma / total) * 100;
      console.log("Categorie:", categorie, "Procent:", procent);
      if (praguri[categorie] && procent >= praguri[categorie]) {
        sfaturi.push(...(sfaturiMap[categorie] || []));
      }
    });

    // 🔽 Regula 2: tranzacții frecvente (totale, nu doar luna)
    if (cheltuieli.length > 25) {
      sfaturi.push("Ai un număr mare de tranzacții. Încearcă să reduci cumpărăturile impulsive.");
    }

    // 🔽 Regula 3: depășire buget
    const bugete = await buget.findAll({ where: { utilizator_id: utilizatorId } });

    for (const buget of bugete) {
      const cheltuieliInPerioada = cheltuieli.filter(c => {
        const d = new Date(c.data);
        return d >= buget.data_inceput && d <= buget.data_sfarsit;
      });

      const suma = cheltuieliInPerioada.reduce((acc, c) => acc + Number(c.suma), 0);

      if (suma > buget.suma_maxima) {
        sfaturi.push(`Ai **depășit** bugetul "${buget.titlu}". Revizuiește cheltuielile din perioada respectivă.`);
      }
    }

    // 🔽 Regula 4: creștere față de luna trecută
    const lunaCurenta = azi.getMonth();
    const lunaTrecuta = lunaCurenta === 0 ? 11 : lunaCurenta - 1;

    const cheltLunaCurenta = cheltuieli.filter(c => new Date(c.data).getMonth() === lunaCurenta);
    const cheltLunaTrecuta = cheltuieli.filter(c => new Date(c.data).getMonth() === lunaTrecuta);

    const totalCurent = cheltLunaCurenta.reduce((acc, c) => acc + Number(c.suma), 0);
    const totalTrecut = cheltLunaTrecuta.reduce((acc, c) => acc + Number(c.suma), 0);

    if (totalCurent > totalTrecut) {
      sfaturi.push("Cheltuielile tale au **crescut** față de luna trecută. Analizează dacă este justificat.");
    }

    // 🔽 Fallback
    if (sfaturi.length === 0) {
      sfaturi.push("**Felicitări!!!** Cheltuielile tale sunt echilibrate. Continuă să monitorizezi și să planifici bugetul.");
      sfaturi.push("Nu uita să verifici secțiunea de recompense!");
    }

    res.json({ sfaturi });

  } catch (error) {
    console.error("Eroare la generarea sfaturilor:", error);
    res.status(500).json({
      message: "Eroare internă",
      eroare: error.message,
      stack: error.stack
    });
  }
};


module.exports = { genereazaSfaturi };
