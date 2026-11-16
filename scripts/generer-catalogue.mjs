// Génère catalogue.json À PARTIR de index.html — aucune donnée saisie à la main ici.
// Lancé automatiquement à chaque modification du site (GitHub Action), ou : node scripts/generer-catalogue.mjs
import fs from 'node:fs';
const SITE='https://ddskin.khalam.app/';
const html=fs.readFileSync('index.html','utf8');
const abs=u=>u?new URL(u.replace(/^\.?\//,''),SITE).href:null;
const txt=s=>s.replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
const get=(c,re)=>{const m=c.match(re);return m?txt(m[1]):'';};
const wa=(m)=>'https://wa.me/221781170287?text='+encodeURIComponent(m);
const produits=[];
const cartes=[...html.matchAll(/<article class="([^"]+)">([\s\S]*?)<\/article>/g)];
for(const [,cls,c] of cartes){
  const nom=get(c,/<h3[^>]*>([\s\S]*?)<\/h3>/); if(!nom||cls.includes('range-card'))continue;
  const prix=get(c,/class="price">([\s\S]*?)<\/div>/);
  const description=get(c,/<p>([\s\S]*?)<\/p>/);
  const tag=get(c,/class="tag">([\s\S]*?)<\/span>/)||get(c,/class="individual-meta">([\s\S]*?)<\/span>/);
  const page=(c.match(/href="([^"]+\.html)"/)||[])[1];
  let image=(c.match(/<img[^>]+src="([^"]+)"/)||[])[1];
  const sprite=(c.match(/sprite (sp-[\w-]+)/)||[])[1];
  if(!image&&sprite)image=`assets/offres/${sprite}.jpg`;
  if(!image&&cls.includes('product-card')){const slug=nom.toLowerCase().replace(/\s+/g,'-');if(fs.existsSync(`assets/${slug}.webp`))image=`assets/${slug}.webp`;}
  const dataWa=(c.match(/data-wa="([^"]+)"/)||[])[1];
  const lien=(c.match(/href="(https:\/\/wa\.me[^"]+)"/)||[])[1]||(dataWa?wa(dataWa.replace(/&#39;|&apos;/g,"'")):wa(`Bonjour DD SKIN, je souhaite commander ${nom}${prix?' à '+prix:''}.`));
  const contenu=(c.match(/data-text="([^"]+)"/)||[])[1];
  const type=cls.includes('offer')?'offre':cls.includes('individual')?'unite':'essentiel';
  produits.push({nom,type,categorie:tag||null,description:description||null,contenu:contenu?txt(contenu):null,prix:prix||null,image:abs(image),page:abs(page)||SITE,commander:lien});
}
const catalogue={marque:'DD SKIN',site:SITE,whatsapp:'+221 78 117 02 87',genere_le:new Date().toISOString(),source:'index.html',produits};
fs.writeFileSync('catalogue.json',JSON.stringify(catalogue,null,1));
console.log(produits.length,'produits');
