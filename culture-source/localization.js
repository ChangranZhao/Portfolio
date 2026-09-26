import {archiveAssets} from './archive-assets.js';

const titles=[
 'Zibo · Industrial park','Lobed-rim bowl','Zibo · Television production','Moulded porcelain bowl','Zibo · Textile industry','White-glazed incised dish','Zibo · Early industry','Qingbai incised bowl','Zibo · Industrial architecture','Ant-nose coins','Zibo · Modern architecture','Qi knife-coin mould','Zibo · Chemical industrial park','Numeral coins','Zibo · Commercial architecture','Spade coins','Zibo · Power facilities I','Animal-shaped wine vessel','Zibo · Power facilities II','Bronze cooking vessel','Zibo · Machining','Bronze mortar','Zibo · Railway station','Goose-foot lamp','Zibo · Comprehensive bonded zone','Youli bronze measures','Zibo · Industrial transport','Pottery steamer','Zibo · Production workshop','Pottery lei vessel','Zibo · Machinery manufacturing','Pottery fang vessel','Zibo · Industrial site','Pottery hu vessel','Zibo · Factory buildings','Tile end with tree, birds and beasts','Zibo · Transport','Tile end with tree, clouds and birds','Zibo · Industrial development','Tile end with tree and taotie','Zibo · Textile workshop','Dragon-pattern tile end','Zibo · Metal materials','Jade dagger-axe','Zibo · Machinery','Agate ornaments','Zibo · Large production equipment','Jade disc with spiral pattern','Zibo · Kiln architecture','Tubular chalcedony beads','Zibo · Cultural architecture','Zibo · Ceramics and glass','Zibo · Production line','Zibo · Textile machinery','Zibo · Heavy industrial equipment','Zibo · Textile factory',
];
const descriptions={
 1:'Song dynasty. Height 7.5 cm; rim diameter 20.6 cm. Excavated in 1978 at Zihedian, Qiling.',
 3:'Song dynasty. Height 6.5 cm; rim diameter 19.5 cm. Excavated in 1978 at Zihedian, Qiling.',
 5:'Song dynasty. Height 4.8 cm; rim diameter 22.1 cm. Excavated in 1978 at Zihedian, Qiling.',
 7:'Song dynasty. Rim diameter 13.8 cm; height 3.5 cm. Excavated in 1987 at the weaving mill in Qidu.',
 9:'Warring States period. Length 1.7 cm.',
 11:'Eastern Zhou period. Surviving length 10 cm; width 13.2 cm; thickness 3.6 cm. Excavated in 1964 at Beianhe village, Qidu.',
 13:'Han dynasty. Diameter 3.4–3.5 cm; central hole 1.2 cm. Excavated in 1975 at Shangwangzhuang, Jixia.',
 15:'Warring States period. Length 5.6 cm; width 2.0 cm.',
 17:'Warring States period. Height 28.3 cm; length 46.0 cm. Excavated in 1982 at Shangwang cemetery, Jixia.',
 19:'Han dynasty. Height 12.3 cm; rim diameter 15.4 cm. Excavated in 1984 at Chijiatuan village, Fenghuang.',
 21:'Han dynasty. Height 11.5 cm; rim diameter 10.2 cm. Excavated in 1983 at the Jishan Han tomb, Liangjiazhong village, Jixia.',
 23:'Warring States period. Height 36.0 cm; diameter 24.0 cm. Excavated in 1992 at Shangwang cemetery, Jixia.',
 25:'Warring States period. Larger measure: height 9.5 cm, rim diameter 14.0 cm, capacity 2,050 ml. Smaller measure: height 6.0 cm, rim diameter 7.5 cm, capacity 1,025 ml.',
 27:'Western Han dynasty. Height 45 cm; rim diameter 13 cm; body diameter 34.5 cm. Excavated in 1979 from an accompanying pit of the Han King of Qi tomb at Wotuo, Xindian.',
 29:'Western Han dynasty. Height 33 cm; rim diameter 16 cm. Excavated in 1979 from an accompanying pit of the Han King of Qi tomb at Wotuo, Xindian.',
 31:'Western Han dynasty. Height 51.5 cm; rim diameter 13 cm. Excavated in 1979 from an accompanying pit of the Han King of Qi tomb at Wotuo, Xindian.',
 33:'Western Han dynasty. Height 56 cm; rim diameter 19.5 cm. Excavated in 1978 from an accompanying pit of the Han King of Qi tomb at Wotuo, Xindian.',
 35:'Warring States period. Length 14.5 cm; height 7.2 cm. Excavated at Gejia village, Qidu.',
 37:'Warring States period. Length 15 cm; height 8.5 cm. Excavated at the ancient capital of Qi, Linzi.',
 39:'Warring States period. Length 17 cm; height 9.5 cm. Excavated at the ancient capital of Qi, Linzi.',
 41:'Warring States period. Length 15 cm; height 7 cm. Excavated at the ancient capital of Qi, Linzi.',
 43:'Shang dynasty. Length 8.5 cm; width 5.4 cm.',
 45:'Spring and Autumn period. Agate ring diameters 4.7–5.7 cm; silkworm-shaped ornaments 8.7–10.1 cm long. Excavated in 1972 at Eastern Zhou sacrificial burial No. 1, Langjiazhuang, Qidu.',
 47:'Warring States period. Diameter 15.8 cm. Excavated in 1992 at Shangwang cemetery, Jixia.',
 49:'Spring and Autumn period. Length 5.5 cm; diameter 0.8 cm. Excavated in 1972 at Eastern Zhou sacrificial burial No. 1, Langjiazhuang, Qidu.',
};
const lookup=new Map(archiveAssets.map((a,i)=>[a.src,{title:titles[i],description:descriptions[i]||'Modern industrial archive of Zibo. Original captions are retained within the source image.',source:a.sourceUrl?'Qi Heritage Museum':'User-provided industrial archive'}]));
export const localizeAsset=(a,lang)=>a.story?(lang==='en'?{...a,title:a.en,description:a.summaryEn+'\nFramework reading: '+a.reasonEn+'\nImage: '+a.captionEn,source:a.credit}:a):lang==='en'?{...a,...lookup.get(a.src)}:a;
export const themeEnglish=[
 {short:'Ability & achievement',tags:'Skill · Merit · Creation',note:'Craft and production offer a lens on knowledge, ability and creative achievement.'},
 {short:'Inclusiveness & openness',tags:'Exchange · Diversity · Connection',note:'Ornaments, transport and urban spaces are linked through exchange and cultural diversity.'},
 {short:'Pragmatism & adaptation',tags:'Utility · Change · Innovation',note:'Everyday objects and industrial equipment reveal changing needs and technical adaptation.'},
 {short:'Commerce & industry',tags:'Trade · Making · Circulation',note:'Coins, measures and industrial archives are brought together around production and exchange.'},
];
