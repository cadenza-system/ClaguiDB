import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Dummy YouTube URLs - real classical guitar performance videos
const YOUTUBE_URLS = [
  'https://www.youtube.com/watch?v=inBKFMB-yPg', // Recuerdos de la Alhambra
  'https://www.youtube.com/watch?v=C0ZffnqJsJw', // Romance (Forbidden Games)
  'https://www.youtube.com/watch?v=0tXMk2BZ0Ek', // Asturias
  'https://www.youtube.com/watch?v=lCeebWgjrrU', // Cavatina
  'https://www.youtube.com/watch?v=kn0KL8K0isA', // Classical Guitar
  'https://www.youtube.com/watch?v=g8-IfMPwUpc', // Bach Cello Suite
  'https://www.youtube.com/watch?v=2bosouX_d8Y', // La Catedral
  'https://www.youtube.com/watch?v=jxNV3TDqH0E', // Capricho Arabe
  'https://www.youtube.com/watch?v=HNS7vN1gJ6s', // Gran Vals
  'https://www.youtube.com/watch?v=5v_8M8eyPfY', // Concierto de Aranjuez
];

interface ComposerData {
  names: string[];
  bio: string;
  birthYear: number;
  deathYear: number | null;
  country: string;
  pieces: PieceData[];
}

interface PieceData {
  names: string[];
  compositionYear?: number;
}

// Data extracted from docs/output.txt (Classical Guitar Music Guide)
const composers: ComposerData[] = [
  {
    names: ['Julian Aguirre', 'フリアン・アギーレ'],
    bio: 'アルゼンチンの作曲家。民族楽派のはしりとも呼ばれる。',
    birthYear: 1868,
    deathYear: 1924,
    country: 'Argentina',
    pieces: [
      { names: ['Triste No.1', 'トリステ第1番'] },
      { names: ['Triste No.2', 'トリステ第2番'] },
      { names: ['Triste No.5', 'トリステ第5番'] },
      { names: ['Huit Petites Pieces Op.3', '8つの小品 Op.3'] },
      { names: ['Six Petites Pieces Op.4', '6つの小品 Op.4'] },
    ],
  },
  {
    names: ['Dionisio Aguado', 'ディオニシオ・アグアド'],
    bio: 'スペインの作曲家・ギタリスト。ギター教育に多大な貢献をした。',
    birthYear: 1784,
    deathYear: 1849,
    country: 'Spain',
    pieces: [
      { names: ['Rondo brillante en la Op.2', '華麗なるロンド イ短調 Op.2'] },
      { names: ['Fandango variado Op.16', '変奏付きファンダンゴ Op.16'] },
      { names: ['Le Menuet Affandangado Op.15', 'ファンダンゴ風メヌエット Op.15'] },
      { names: ['Estudios', '練習曲集'] },
      { names: ['27 Studies for guitar', '27の練習曲'] },
    ],
  },
  {
    names: ['Sergio Assad', 'セルジオ・アサド'],
    bio: 'ブラジルの作曲家・ギタリスト。アサド兄弟として知られる。',
    birthYear: 1952,
    deathYear: null,
    country: 'Brazil',
    pieces: [
      { names: ['Aquarelle', 'アクアレル'], compositionYear: 1986 },
      { names: ['Jobiniana No.3', 'ジョビニアーナ第3番'], compositionYear: 1996 },
      { names: ['Sonata for guitar solo', 'ソナタ'], compositionYear: 1999 },
      { names: ['Lejania (Preludio No.1)', 'はるけさ（前奏曲第1番）'] },
      { names: ['Aire nortefio', '北方人の歌'] },
    ],
  },
  {
    names: ['Isaac Albeniz', 'イサーク・アルベニス'],
    bio: 'スペインの作曲家・ピアニスト。スペイン国民楽派を代表する作曲家。',
    birthYear: 1860,
    deathYear: 1909,
    country: 'Spain',
    pieces: [
      { names: ['Asturias (Leyenda)', 'アストゥリアス（伝説）'], compositionYear: 1892 },
      { names: ['Granada (Serenata)', 'グラナダ'], compositionYear: 1886 },
      { names: ['Sevilla', 'セビーリャ'], compositionYear: 1886 },
      { names: ['Rumores de la Caleta (Malaguena)', '入江のざわめき'] },
      { names: ['Cadiz (Serenata)', 'カディス'] },
      { names: ['Cordoba', 'コルドバ'] },
      { names: ['Mallorca Op.202', 'マジョルカ Op.202'], compositionYear: 1890 },
      { names: ['Torre bermeja', '朱色の塔'] },
      { names: ['Zambra Granadina', 'サンブラ・グラナディーナ'] },
      { names: ['Tango en Re Op.165-2', 'タンゴ ニ長調 Op.165-2'] },
      { names: ['Capricho Catalan', 'カタルーニャ奇想曲'] },
    ],
  },
  {
    names: ['Heitor Villa-Lobos', 'エイトル・ヴィラ=ロボス'],
    bio: 'ブラジルの作曲家。20世紀最大のギター作曲家の一人。',
    birthYear: 1887,
    deathYear: 1959,
    country: 'Brazil',
    pieces: [
      { names: ['Choros No.1', 'ショーロス第1番'], compositionYear: 1920 },
      { names: ['Prelude No.1', '前奏曲第1番'], compositionYear: 1940 },
      { names: ['Prelude No.2', '前奏曲第2番'], compositionYear: 1940 },
      { names: ['Prelude No.3', '前奏曲第3番'], compositionYear: 1940 },
      { names: ['Prelude No.4', '前奏曲第4番'], compositionYear: 1940 },
      { names: ['Prelude No.5', '前奏曲第5番'], compositionYear: 1940 },
      { names: ['Etude No.1', '練習曲第1番'], compositionYear: 1929 },
      { names: ['Etude No.11', '練習曲第11番'], compositionYear: 1929 },
      { names: ['Mazurka-Choro', 'マズルカ＝ショーロ'] },
      { names: ['Valsa-Choro', 'ワルツ＝ショーロ'] },
      { names: ['Gavota-Choro', 'ガヴォット＝ショーロ'] },
      { names: ['Schottisch-Choro', 'ショティッシュ＝ショーロ'] },
      { names: ['Chorinho', 'ショリーニョ'] },
    ],
  },
  {
    names: ['Leopold Silvius Weiss', 'レオポルト・ジルヴィウス・ヴァイス'],
    bio: 'ポーランド生まれドイツで活躍したバロック期のリュート奏者・作曲家。',
    birthYear: 1686,
    deathYear: 1750,
    country: 'Germany',
    pieces: [
      { names: ['Suite D-moll', '組曲 ニ短調'] },
      { names: ['Suite in D', '組曲 ニ長調'] },
      { names: ['Passacaglia', 'パッサカリア'] },
      { names: ['Fantaisie', 'ファンタジー'] },
      { names: ['Tombeau du Logy', 'ロジー伯爵の墓'] },
      { names: ['Chaconne', 'シャコンヌ'] },
    ],
  },
  {
    names: ['Mario Castelnuovo-Tedesco', 'マリオ・カステルヌオーヴォ＝テデスコ'],
    bio: 'イタリア出身、アメリカで活躍した作曲家。セゴビアと深い親交があった。',
    birthYear: 1895,
    deathYear: 1968,
    country: 'Italy',
    pieces: [
      { names: ['Capriccio diabolico', '悪魔の奇想曲'] },
      { names: ['Tarantella Op.87-a', 'タランテラ Op.87-a'], compositionYear: 1936 },
      { names: ['Variations a travers les siecles Op.71', '世紀を渡る変奏曲 Op.71'], compositionYear: 1932 },
      { names: ['Sonata "Omaggio a Boccherini" Op.77', 'ソナタ「ボッケリーニ讃」Op.77'], compositionYear: 1934 },
      { names: ['Platero y yo Op.190', 'プラテーロと私 Op.190'] },
      { names: ['Tonadilla Op.170-5', 'トナディーリャ Op.170-5'] },
      { names: ['Rondel Op.170-6', 'ロンデール Op.170-6'] },
      { names: ['Aranci in Fiore Op.87b', '花咲くオレンジ Op.87b'], compositionYear: 1936 },
    ],
  },
  {
    names: ['Matteo Carcassi', 'マッテオ・カルカッシ'],
    bio: 'イタリアの作曲家・ギタリスト。教則本で知られる。',
    birthYear: 1792,
    deathYear: 1853,
    country: 'Italy',
    pieces: [
      { names: ['25 Etudes Op.60', '25の練習曲 Op.60'], compositionYear: 1836 },
      { names: ['Au Clair de la Lune, Varie Op.7', 'フランス民謡「月の光」の主題による変奏曲 Op.7'] },
      { names: ['Fantaisie sur des motifs de Guillaume Tell Op.36', 'ウイリアム・テルによる幻想曲 Op.36'] },
    ],
  },
  {
    names: ['Ferdinando Carulli', 'フェルディナンド・カルッリ'],
    bio: 'イタリアの作曲家・ギタリスト。おびただしい数の作品を残した。',
    birthYear: 1770,
    deathYear: 1841,
    country: 'Italy',
    pieces: [
      { names: ['3 Sonatas Op.21', '3つのソナタ Op.21'] },
      { names: ['Overture Op.6-1', '序曲 Op.6-1'] },
      { names: ['45 Etudes', '45のエチュード'] },
    ],
  },
  {
    names: ['Abel Carlevaro', 'アベル・カルレバーロ'],
    bio: 'ウルグアイの作曲家・ギタリスト。ギター奏法の革新者。',
    birthYear: 1916,
    deathYear: 2001,
    country: 'Uruguay',
    pieces: [
      { names: ['5 Preludios Americanos', '5つの南米風前奏曲'] },
      { names: ['5 Estudios', '5つの練習曲'] },
      { names: ['Cronomias I (Sonata)', 'クロノミアス I（ソナタ）'] },
      { names: ['Microestudios', 'ミクロエストウディオス'] },
      { names: ['Milonga Oriental', 'ミロンガ・オリエンタル'] },
    ],
  },
  {
    names: ['Jorge Cardoso', 'ホルヘ・カルドーソ'],
    bio: 'アルゼンチンの作曲家・ギタリスト。南米の民俗音楽を取り入れた作品で知られる。',
    birthYear: 1949,
    deathYear: null,
    country: 'Argentina',
    pieces: [
      { names: ['Suite Popular No.3 "Sudamericana"', '南アメリカ民謡組曲'] },
      { names: ['Milonga', 'ミロンガ'] },
    ],
  },
  {
    names: ['Napoleon Coste', 'ナポレオン・コスト'],
    bio: 'フランスの作曲家・ギタリスト。ロマン派ギター音楽の重要な作曲家。',
    birthYear: 1805,
    deathYear: 1883,
    country: 'France',
    pieces: [
      { names: ['Le Depart Op.31', '旅立ち Op.31'], compositionYear: 1855 },
      { names: ['25 Etudes de genre Op.38', '25の練習曲 Op.38'], compositionYear: 1860 },
      { names: ['Grand Serenade Op.30', 'グラン・セレナーデ Op.30'] },
      { names: ['La Ronde de Mai Op.42', '5月のロンド Op.42'] },
      { names: ['Marche Funebre et Rondeau Op.43', '葬送行進曲とロンド Op.43'] },
      { names: ['La Source du Lyson Op.47', 'リゾンの泉 Op.47'] },
    ],
  },
  {
    names: ['Mauro Giuliani', 'マウロ・ジュリアーニ'],
    bio: 'イタリアの作曲家・ギタリスト。19世紀最高のギター・ヴィルトゥオーゾの一人。',
    birthYear: 1781,
    deathYear: 1829,
    country: 'Italy',
    pieces: [
      { names: ['Grand Overture Op.61', '大序曲 Op.61'], compositionYear: 1808 },
      { names: ['Rossiniana No.1 Op.119', 'ロッシニアーナ第1番 Op.119'], compositionYear: 1820 },
      { names: ['Variations on Handel\'s Harmonious Blacksmith Op.107', '調子の良い鍛冶屋による変奏曲 Op.107'] },
      { names: ['Gran Sonata Eroica Op.150', '英雄ソナタ Op.150'], compositionYear: 1828 },
      { names: ['Le Papillon Op.50', '蝶々 Op.50'], compositionYear: 1815 },
      { names: ['Sonata Op.15', 'ソナタ Op.15'] },
      { names: ['6 Variations on Folia d\'Espagne Op.45', 'スペインのフォリアによる変奏曲 Op.45'] },
      { names: ['Giulianate Op.148', 'ジュリアナーテ Op.148'] },
      { names: ['Etudes choisies Op.111', '練習曲集 Op.111'] },
    ],
  },
  {
    names: ['Eduardo Sainz de la Maza', 'エドゥアルド・サインス・デ・ラ・マーサ'],
    bio: 'スペインの作曲家・ギタリスト。兄レヒーノとともにスペインギター界を代表。',
    birthYear: 1903,
    deathYear: 1982,
    country: 'Spain',
    pieces: [
      { names: ['Campanas del alba', '暁の鐘'] },
      { names: ['Homenaje a la Guitarra', 'ギター讃歌'] },
      { names: ['Suite "Platero y Yo"', '組曲「プラテーロと私」'] },
      { names: ['Habanera', 'ハバネラ'] },
      { names: ['Bolero', 'ボレロ'] },
    ],
  },
  {
    names: ['Regino Sainz de la Maza', 'レヒーノ・サインス・デ・ラ・マーサ'],
    bio: 'スペインの作曲家・ギタリスト。アランフエス協奏曲の初演者。',
    birthYear: 1896,
    deathYear: 1981,
    country: 'Spain',
    pieces: [
      { names: ['El Vito', 'エル・ビート'] },
      { names: ['Zapateado', 'サパテアード'] },
      { names: ['Petenera', 'ペテネーラ'] },
      { names: ['Rondena', 'ロンデーニャ'] },
    ],
  },
  {
    names: ['Julio Salvador Sagreras', 'フリオ・サルバドール・サグレラス'],
    bio: 'アルゼンチンの作曲家・ギタリスト。教則本で名高い。',
    birthYear: 1879,
    deathYear: 1942,
    country: 'Argentina',
    pieces: [
      { names: ['El colibri', '蜂雀'] },
      { names: ['Maria Luisa Op.19-2', 'マリア・ルイサ Op.19-2'] },
    ],
  },
  {
    names: ['Carlos Guastavino', 'カルロス・グァスタビーノ'],
    bio: 'アルゼンチンの作曲家。民俗的音楽に根付いた作品を残した。',
    birthYear: 1912,
    deathYear: 2000,
    country: 'Argentina',
    pieces: [
      { names: ['3 Sonatas', '3つのソナタ'] },
    ],
  },
  {
    names: ['Francois Couperin', 'フランソワ・クープラン'],
    bio: 'フランスのバロック作曲家。クラヴサン（チェンバロ）音楽の大家。',
    birthYear: 1668,
    deathYear: 1733,
    country: 'France',
    pieces: [
      { names: ['Les barricades mysterieuses', '神秘的なバリケード'] },
    ],
  },
  {
    names: ['Akira Ifukube', '伊福部昭'],
    bio: '日本の作曲家。映画音楽でも知られる。',
    birthYear: 1914,
    deathYear: 2006,
    country: 'Japan',
    pieces: [
      { names: ['Toka', '踏歌'], compositionYear: 1968 },
      { names: ['Kugoka', '笙模歌'], compositionYear: 1969 },
      { names: ['Toccata per chitarra', 'ギターのためのトッカータ'], compositionYear: 1970 },
    ],
  },
  {
    names: ['Jacques Ibert', 'ジャック・イベール'],
    bio: 'フランスの作曲家。',
    birthYear: 1890,
    deathYear: 1962,
    country: 'France',
    pieces: [
      { names: ['Ariette', 'アリエット'], compositionYear: 1935 },
      { names: ['Francaise', 'フランセーズ'], compositionYear: 1926 },
    ],
  },
  {
    names: ['William Walton', 'ウィリアム・ウォルトン'],
    bio: 'イギリスの作曲家。',
    birthYear: 1902,
    deathYear: 1983,
    country: 'United Kingdom',
    pieces: [
      { names: ['5 bagatelles for guitar', '5つのバガテル'] },
    ],
  },
  {
    names: ['Maurice Ohana', 'モーリス・オアナ'],
    bio: 'ジブラルタル生まれ、フランスで活躍した作曲家。10弦ギターのための作品を多数残す。',
    birthYear: 1914,
    deathYear: 1992,
    country: 'France',
    pieces: [
      { names: ['Tiento', 'ティエント'], compositionYear: 1950 },
      { names: ['Si le jour parait', '朝日が昇ったなら'] },
    ],
  },
  {
    names: ['Julian Orbon', 'フリアン・オルボン'],
    bio: 'キューバの作曲家。',
    birthYear: 1925,
    deathYear: 1991,
    country: 'Cuba',
    pieces: [
      { names: ['Preludio y danza (toccata)', '前奏曲と舞曲（トッカータ）'] },
    ],
  },
  {
    names: ['Gaspar Cassado y Moreu', 'ガスパール・カサド'],
    bio: 'スペインのチェリスト・作曲家。',
    birthYear: 1897,
    deathYear: 1966,
    country: 'Spain',
    pieces: [
      { names: ['Preamblo y Sardana', '前奏曲とサルダーナ'] },
      { names: ['Cancion de Leonardo', 'レオナルドの歌'] },
    ],
  },
  {
    names: ['Laurindo Almeida', 'ローリンド・アルメイダ'],
    bio: 'ブラジルの作曲家・ギタリスト。ジャズやクラシックなど多岐に渡る活動で知られる。',
    birthYear: 1917,
    deathYear: 1995,
    country: 'Brazil',
    pieces: [
      { names: ['Brazilliance', 'ブラジリアンス'] },
      { names: ['Danza Gitana', 'ジプシー舞曲'] },
      { names: ['Pavana for Pancho', 'パンチョのパバーナ'] },
    ],
  },
];

async function main() {
  console.log('Seeding database with data from Classical Guitar Music Guide...');

  // Create system user for seeding
  const systemUser = await prisma.user.upsert({
    where: { googleId: 'system-seeder' },
    update: {},
    create: {
      googleId: 'system-seeder',
      email: 'system@example.com',
      name: 'System Seeder',
      isPremium: true,
    },
  });

  console.log(`Created system user: ${systemUser.id}`);

  // Make user admin
  await prisma.admin.upsert({
    where: { userId: systemUser.id },
    update: {},
    create: {
      userId: systemUser.id,
    },
  });

  let pieceCount = 0;
  let composerCount = 0;

  for (const composerData of composers) {
    // Create person (composer)
    const person = await prisma.person.create({
      data: {
        bio: composerData.bio,
        birthYear: composerData.birthYear,
        deathYear: composerData.deathYear,
        country: composerData.country,
        createdByUserId: systemUser.id,
      },
    });

    // Create person names
    for (const name of composerData.names) {
      await prisma.personName.create({
        data: {
          personId: person.id,
          name,
        },
      });
    }

    composerCount++;
    console.log(`Created composer: ${composerData.names[0]}`);

    // Create pieces
    for (const pieceData of composerData.pieces) {
      const piece = await prisma.piece.create({
        data: {
          composerId: person.id,
          compositionYear: pieceData.compositionYear,
          createdByUserId: systemUser.id,
        },
      });

      // Create piece names
      for (const name of pieceData.names) {
        await prisma.pieceName.create({
          data: {
            pieceId: piece.id,
            name,
          },
        });
      }

      // Add YouTube video (random from dummy URLs)
      const randomUrl = YOUTUBE_URLS[Math.floor(Math.random() * YOUTUBE_URLS.length)];
      await prisma.youtubeVideo.create({
        data: {
          pieceId: piece.id,
          url: randomUrl,
          approvalStatus: 'approved',
          createdByUserId: systemUser.id,
          approvedByAdminId: systemUser.id,
        },
      });

      pieceCount++;
    }
  }

  // Create some tags
  const tags = [
    'Romantic',
    'Baroque',
    'Modern',
    'Spanish',
    'Latin American',
    'Etude',
    'Sonata',
    'Suite',
    'Variations',
    'Tremolo',
    'Brazilian',
    'Argentine',
    'French',
    'Italian',
    'German',
  ];

  for (const tagName of tags) {
    await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: {
        name: tagName,
        createdByUserId: systemUser.id,
      },
    });
  }

  console.log('---');
  console.log(`Seeding completed!`);
  console.log(`Created ${composerCount} composers`);
  console.log(`Created ${pieceCount} pieces with YouTube videos`);
  console.log(`Created ${tags.length} tags`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
