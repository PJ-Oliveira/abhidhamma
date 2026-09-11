
export type CittaJati = 'Kusala' | 'Akusala' | 'Vipāka' | 'Kiriya';
export type CittaBhumi = 'Kāmāvacara' | 'Rūpāvacara' | 'Arūpāvacara' | 'Lokuttara';

export interface Citta {
    id: string;
    paliName: string;
    englishTranslation: string;
    jati: CittaJati;
    bhumi: CittaBhumi;
    description: string;
    // The exact Cetasikas that arise with this Citta (Sampayoga method)
    associatedCetasikas: string[]; 
}

// ---------------------------------------------------------
// Akusala (Unwholesome) Cittas
// ---------------------------------------------------------

export const DosaMula1: Citta = {
    id: 'citta_ak_dosa_1',
    paliName: 'Domanassasahagata paṭighasampayutta asaṅkhārika citta',
    englishTranslation: 'Unprompted consciousness accompanied by displeasure and associated with aversion',
    jati: 'Akusala',
    bhumi: 'Kāmāvacara',
    description: 'The first consciousness rooted in hatred, arising spontaneously.',
    associatedCetasikas: [
        'Phassa', 'Vedanā', 'Saññā', 'Cetanā', 'Ekaggatā', 'Jīvitindriya', 'Manasikāra', // 7 Universals
        'Vitakka', 'Vicāra', 'Adhimokkha', 'Viriya', // 4 Occasionals
        'Moha', 'Ahirika', 'Anottappa', 'Uddhacca', // 4 Universal Immorals
        'Dosa' // Specific Immoral
    ]
};

export const LobhaMula1: Citta = {
    id: 'citta_ak_lobha_1',
    paliName: 'Somanassasahagata diṭṭhigatasampayutta asaṅkhārika citta',
    englishTranslation: 'Unprompted consciousness accompanied by joy, associated with wrong view',
    jati: 'Akusala',
    bhumi: 'Kāmāvacara',
    description: 'The first consciousness rooted in greed, arising spontaneously with joy and wrong view.',
    associatedCetasikas: [
        'Phassa', 'Vedanā', 'Saññā', 'Cetanā', 'Ekaggatā', 'Jīvitindriya', 'Manasikāra', // 7 Universals
        'Vitakka', 'Vicāra', 'Adhimokkha', 'Viriya', 'Pīti', 'Chanda', // 6 Occasionals
        'Moha', 'Ahirika', 'Anottappa', 'Uddhacca', // 4 Universal Immorals
        'Lobha', 'Diṭṭhi' // Specific Immorals
    ]
};

// ---------------------------------------------------------
// Kusala (Wholesome) Cittas
// ---------------------------------------------------------

export const MahaKusala1: Citta = {
    id: 'citta_ku_maha_1',
    paliName: 'Somanassasahagata ñāṇasampayutta asaṅkhārika citta',
    englishTranslation: 'Unprompted consciousness accompanied by joy, associated with knowledge',
    jati: 'Kusala',
    bhumi: 'Kāmāvacara',
    description: 'The first sense-sphere wholesome consciousness, arising spontaneously with joy and wisdom.',
    associatedCetasikas: [
        'Phassa', 'Vedanā', 'Saññā', 'Cetanā', 'Ekaggatā', 'Jīvitindriya', 'Manasikāra', // 7 Universals
        'Vitakka', 'Vicāra', 'Adhimokkha', 'Viriya', 'Pīti', 'Chanda', // 6 Occasionals
        'Saddhā', 'Sati', 'Hiri', 'Ottappa', 'Alobha', 'Adosa', // Beautiful Universals...
        'Tatra-majjhattatā', 'Kāyapassaddhi', 'Cittapassaddhi', 'Kāyalahutā', 'Cittalahutā',
        'Kāyamudutā', 'Cittamudutā', 'Kāyakammaññatā', 'Cittakammaññatā',
        'Kāyapāguññatā', 'Cittapāguññatā', 'Kāyujukatā', 'Cittujukatā',
        'Paññindriya' // Wisdom
    ]
};

// ---------------------------------------------------------
// Vipāka (Resultant) Cittas
// ---------------------------------------------------------

export const MahaVipaka1: Citta = {
    id: 'citta_vi_maha_1',
    paliName: 'Somanassasahagata ñāṇasampayutta asaṅkhārika citta',
    englishTranslation: 'Unprompted resultant consciousness accompanied by joy, associated with knowledge',
    jati: 'Vipāka',
    bhumi: 'Kāmāvacara',
    description: 'The first sense-sphere resultant consciousness, acting as bhavanga, patisandhi, or cuti.',
    associatedCetasikas: [
        'Phassa', 'Vedanā', 'Saññā', 'Cetanā', 'Ekaggatā', 'Jīvitindriya', 'Manasikāra', // 7 Universals
        'Vitakka', 'Vicāra', 'Adhimokkha', 'Viriya', 'Pīti', 'Chanda', // 6 Occasionals
        'Saddhā', 'Sati', 'Hiri', 'Ottappa', 'Alobha', 'Adosa', // Beautiful Universals
        'Tatra-majjhattatā', 'Kāyapassaddhi', 'Cittapassaddhi', 'Kāyalahutā', 'Cittalahutā',
        'Kāyamudutā', 'Cittamudutā', 'Kāyakammaññatā', 'Cittakammaññatā',
        'Kāyapāguññatā', 'Cittapāguññatā', 'Kāyujukatā', 'Cittujukatā',
        'Paññindriya' // Wisdom
    ]
};

// ---------------------------------------------------------
// Kiriya (Functional) Cittas
// ---------------------------------------------------------

export const MahaKiriya1: Citta = {
    id: 'citta_ki_maha_1',
    paliName: 'Somanassasahagata ñāṇasampayutta asaṅkhārika citta',
    englishTranslation: 'Unprompted functional consciousness accompanied by joy, associated with knowledge',
    jati: 'Kiriya',
    bhumi: 'Kāmāvacara',
    description: 'The first sense-sphere functional consciousness, experienced only by Arahants.',
    associatedCetasikas: [
        'Phassa', 'Vedanā', 'Saññā', 'Cetanā', 'Ekaggatā', 'Jīvitindriya', 'Manasikāra', // 7 Universals
        'Vitakka', 'Vicāra', 'Adhimokkha', 'Viriya', 'Pīti', 'Chanda', // 6 Occasionals
        'Saddhā', 'Sati', 'Hiri', 'Ottappa', 'Alobha', 'Adosa', // Beautiful Universals
        'Tatra-majjhattatā', 'Kāyapassaddhi', 'Cittapassaddhi', 'Kāyalahutā', 'Cittalahutā',
        'Kāyamudutā', 'Cittamudutā', 'Kāyakammaññatā', 'Cittakammaññatā',
        'Kāyapāguññatā', 'Cittapāguññatā', 'Kāyujukatā', 'Cittujukatā',
        'Paññindriya' // Wisdom
    ]
};

export const AllCittas: Record<string, Citta> = {
    DosaMula1,
    LobhaMula1,
    MahaKusala1,
    MahaVipaka1,
    MahaKiriya1
};
