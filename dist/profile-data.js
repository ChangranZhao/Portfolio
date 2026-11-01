import {awardRecords,exhibitionRecords} from './profile-records.js';
export {awardRecords,exhibitionRecords,innovationRecords} from './profile-records.js';
// Existing portfolio facts, shared by both presentation layers.
export const roles=[
 'Communication University of China',
 'Digital Media Arts (Network and Intelligent Media Design)',
 'Lead of Digital Art Studio “Atavism”',
 'Research Intern at the Design Futures Research Group, Tsinghua University',
 'Previously worked at the Digital Human Lab and the Intelligent Media Design Lab, Communication University of China'
];
export const awards=awardRecords.map(r=>[r.title.en+' — '+r.result.en+' · '+r.work.en,r.date]);
export const commercial=[
 ['Wind Blows from the East Digital Art Exhibition (Qi Culture Classical Museum)','2025.9 – 2026.7','Zibo, Shandong Province, China','p1'],
 ['Digital Media Part in Shanxi Changzhi Museum','2025.6 – 2025.12','Changzhi, Shanxi Province, China','p6'],
 ['Digital Media Part in Wuqiao Acrobatics Museum','2025.9 – 2025.10','Wuqiao, Cangzhou, Hebei, China'],
 ['Five Elements Multimedia Dance “Water Part” (collaboration with Tianjin College of Media & Arts)','2024.11 – 2025.4','Tianjin, China'],
 ['Closing Ceremony of the AIGC Section at the Beijing International Film Festival','2025.4','Beijing, China'],
 ['Miyun Great Wall Castle Digital Smart Exhibition Hall','2025.5 – 2025.7','Beijing, China'],
 ['Electronic Music Stage Visuals, E-Sound Night, Communication University of China','2025.3 – 2025.6','Beijing, China'],
 ['Exhibition in Illuminarium Phaotom Space','2025.3 – 2025.4','Macau, China'],
 ['Echo-Space Interactive Live Performance Series','2024.3 – 2025.3','Beijing, China · London, UK','p4']
];
export const exhibitions=exhibitionRecords.map(r=>[r.title.en,r.date,[r.place.en,r.work.en,r.result.en].filter(Boolean).join(' · ')]);
export const publications=[
 ['Homeward Memories: Designing Interactive Experiences and Cultural Heritage for Future Homes','HCII 2025'],
 ['Bodystorming through Disruption: AI-assisted Design Improvisation Pedagogy','DRS 2026'],
 ['Path of Light: Interactive Narrative Design Based on Mix Reality for Silk Road Cultural Perception','UIST Adjunct 2025'],
 ['Echo-Space: Inclusive Orchestral Performance Space with Visual Media','HCII 2025'],
 ['HISTORICAL-IMMERSION — Immersive Memory Re-production System Based on 3D Scanning and Multi-modal Interaction','HCII 2025']
];
