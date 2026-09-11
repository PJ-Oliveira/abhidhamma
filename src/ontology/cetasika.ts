export type CetasikaCategory = 
    | 'Sabbacittasādhāraṇā' // 7 Universals
    | 'Pakiṇṇakā'           // 6 Occasionals
    | 'Akusalā'             // 14 Immorals
    | 'Sobhanasādhāraṇā'    // 19 Beautiful Universals
    | 'Viratiyā'            // 3 Abstinences
    | 'Appamaññāyo'         // 2 Illimitables
    | 'Paññindriya';        // 1 Wisdom

export type EthicValue = 'Kusala' | 'Akusala' | 'Abyākata' | 'Aññasamāna';

export interface Cetasika {
    id: string;
    paliName: string;
    englishTranslation: string;
    category: CetasikaCategory;
    ethicValue: EthicValue;
    description: string;
}

// 7 Universals (Sabbacittasādhāraṇā)
export const Phassa: Cetasika = { id: 'c01', paliName: 'Phassa', englishTranslation: 'Contact', category: 'Sabbacittasādhāraṇā', ethicValue: 'Aññasamāna', description: 'Contact with the object' };
export const Vedanā: Cetasika = { id: 'c02', paliName: 'Vedanā', englishTranslation: 'Feeling', category: 'Sabbacittasādhāraṇā', ethicValue: 'Aññasamāna', description: 'Experiencing the object' };
export const Saññā: Cetasika = { id: 'c03', paliName: 'Saññā', englishTranslation: 'Perception', category: 'Sabbacittasādhāraṇā', ethicValue: 'Aññasamāna', description: 'Marking or perceiving the object' };
export const Cetanā: Cetasika = { id: 'c04', paliName: 'Cetanā', englishTranslation: 'Volition', category: 'Sabbacittasādhāraṇā', ethicValue: 'Aññasamāna', description: 'Intentional effort' };
export const Ekaggatā: Cetasika = { id: 'c05', paliName: 'Ekaggatā', englishTranslation: 'One-pointedness', category: 'Sabbacittasādhāraṇā', ethicValue: 'Aññasamāna', description: 'Concentration on the object' };
export const Jīvitindriya: Cetasika = { id: 'c06', paliName: 'Jīvitindriya', englishTranslation: 'Life Faculty', category: 'Sabbacittasādhāraṇā', ethicValue: 'Aññasamāna', description: 'Vitality that sustains associated mental factors' };
export const Manasikāra: Cetasika = { id: 'c07', paliName: 'Manasikāra', englishTranslation: 'Attention', category: 'Sabbacittasādhāraṇā', ethicValue: 'Aññasamāna', description: 'Directing the mind to the object' };

// Examples of Akusala (Immorals)
export const Lobha: Cetasika = { id: 'c14', paliName: 'Lobha', englishTranslation: 'Attachment/Greed', category: 'Akusalā', ethicValue: 'Akusala', description: 'Clinging to the object' };
export const Dosa: Cetasika = { id: 'c17', paliName: 'Dosa', englishTranslation: 'Hatred/Aversion', category: 'Akusalā', ethicValue: 'Akusala', description: 'Aversion or anger towards the object' };
export const Kukkucca: Cetasika = { id: 'c20', paliName: 'Kukkucca', englishTranslation: 'Remorse/Worry', category: 'Akusalā', ethicValue: 'Akusala', description: 'Brooding over what was done or not done' };

// A complete list would have all 52. We can export them as an array or dictionary.
export const AllCetasikas: Record<string, Cetasika> = {
    Phassa, Vedanā, Saññā, Cetanā, Ekaggatā, Jīvitindriya, Manasikāra,
    Lobha, Dosa, Kukkucca
};
