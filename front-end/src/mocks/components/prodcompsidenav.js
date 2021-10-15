import IfindIcon from '@components/IfindIcon';

export const data = [
    {
        categoryLabel: 'Alle Kategorien',
        categoryURL: '/all',
        categoryIcon: <i className="fa fa-globe" aria-hidden="true"></i>,

        subCategories: [
            {
                categoryLabel: 'Test Category',
                categoryURL: '/all/testcategory',
                //categoryIcon: <IoIcons.IoIosPaper />
            },
            {
                categoryLabel: 'Test Category 2',
                categoryURL: '/all/testcategory2',
                //categoryIcon: <IoIcons.IoIosPaper />
            },
        ]
    },

    {
        categoryLabel: 'Video',
        categoryURL: '/video',
        categoryIcon: <IfindIcon icon="play" className="my-icon" />,

        subCategories: [
            {
                categoryLabel: 'Action',
                categoryURL: '/video/action',
                //categoryIcon: <IoIcons.IoIosPaper />
            },
            {
                categoryLabel: 'Adventure',
                categoryURL: '/video/adventure',
                //categoryIcon: <IoIcons.IoIosPaper />
            },
        ]
    },

    {
        categoryLabel: 'Bekleidung',
        categoryURL: '/apparel',
        categoryIcon: <IfindIcon icon="shirt" className="my-icon" />,

        subCategories: [
            {
                categoryLabel: 'Active Wear',
                categoryURL: '/apparel/activewear',
                //categoryIcon: <IoIcons.IoIosPaper />
            },
            {
                categoryLabel: 'Swimwear',
                categoryURL: '/apparel/swimwear',
                //categoryIcon: <IoIcons.IoIosPaper />
            },
        ]
    },

    {
        categoryLabel: 'Elektro-Großgeräte',
        categoryURL: '/appliances',
        categoryIcon: <IfindIcon icon="washer" className="my-icon" />,

        subCategories: [
            {
                categoryLabel: 'Air Condition',
                categoryURL: '/appliances/aircon',
                //categoryIcon: <IoIcons.IoIosPaper />
            },
            {
                categoryLabel: 'Fridge',
                categoryURL: '/appliances/fridge',
                //categoryIcon: <IoIcons.IoIosPaper />
            },
        ]
    },

    {
        categoryLabel: 'Auto & Motorrad',
        categoryURL: '/automotive',
        categoryIcon: <IfindIcon icon="car-cog" className="my-icon" />,

        subCategories: [
            {
                categoryLabel: 'Parts',
                categoryURL: '/automotive/parts',
                //categoryIcon: <IoIcons.IoIosPaper />
            },
            {
                categoryLabel: 'Fuel Systems',
                categoryURL: '/automotive/fuelsystems',
                //categoryIcon: <IoIcons.IoIosPaper />
            },
        ]
    },

    {
        categoryLabel: 'Baby',
        categoryURL: '/baby',
        categoryIcon: <IfindIcon icon="infant" className="my-icon" />,

        subCategories: [
            {
                categoryLabel: 'Diapers',
                categoryURL: '/baby/diapers',
                //categoryIcon: <IoIcons.IoIosPaper />
            },
            {
                categoryLabel: 'Clothing',
                categoryURL: '/baby/clothing',
                //categoryIcon: <IoIcons.IoIosPaper />
            },
        ]
    },


    {
        categoryLabel: 'Beauty',
        categoryURL: '/beauty',
        categoryIcon: <IfindIcon icon="hair-care" className="my-icon" />,

        subCategories: [
            {
                categoryLabel: 'Body Care',
                categoryURL: '/beauty/bodycare',
                //categoryIcon: <IoIcons.IoIosPaper />
            },
            {
                categoryLabel: 'Skin Care',
                categoryURL: '/beauty/skincare',
                //categoryIcon: <IoIcons.IoIosPaper />
            },
        ]
    },

    {
        categoryLabel: 'Bücher',
        categoryURL: '/books',
        categoryIcon: <IfindIcon icon="foreign-books" className="my-icon" />,

        subCategories: [
            {
                categoryLabel: 'Fantasy',
                categoryURL: '/books/fantasy',
                //categoryIcon: <IoIcons.IoIosPaper />
            },
            {
                categoryLabel: 'Classics',
                categoryURL: '/books/classics',
                //categoryIcon: <IoIcons.IoIosPaper />
            },
        ]
    },

    {
        categoryLabel: 'Klassik',
        categoryURL: '/classical',
        categoryIcon: <IfindIcon icon="pillars" className="my-icon" />,

        subCategories: [
            {
                categoryLabel: 'Test Category',
                categoryURL: '/classical/testcategory',
                //categoryIcon: <IoIcons.IoIosPaper />
            },
            {
                categoryLabel: 'Test Category 2',
                categoryURL: '/classical/testcategory2',
                //categoryIcon: <IoIcons.IoIosPaper />
            },
        ]
    },

    {
        categoryLabel: 'Computer & Zubehör',
        categoryURL: '/computer',
        categoryIcon: <IfindIcon icon="pc" className="my-icon" />,

        subCategories: [
            {
                categoryLabel: 'CPU',
                categoryURL: '/computer/cpu',
                //categoryIcon: <IoIcons.IoIosPaper />
            },
            {
                categoryLabel: 'Motherboards',
                categoryURL: '/computer/motherboards',
                //categoryIcon: <IoIcons.IoIosPaper />
            },
            {
                categoryLabel: 'Memory',
                categoryURL: '/computer/memory',
                //categoryIcon: <IoIcons.IoIosPaper />
            },
            {
                categoryLabel: 'Disk Storage',
                categoryURL: '/computer/diskstorage',
                //categoryIcon: <IoIcons.IoIosPaper />
            },
            {
                categoryLabel: 'PSU',
                categoryURL: '/computer/psu',
                //categoryIcon: <IoIcons.IoIosPaper />
            },
        ]
    },

    // {
    //     categoryLabel: 'Musik-Downloads',
    //     categoryURL: '/digitalmusic',
    //     categoryIcon: <IfindIcon icon="binary-headset" className="my-icon" />,

    //     subCategories: [
    //         {
    //             categoryLabel: 'Drum and Bass',
    //             categoryURL: '/digitalmusic/drumandbass',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Techno',
    //             categoryURL: '/digitalmusic/techno',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //     ]
    // },

    // {
    //     categoryLabel: 'Elektronik & Foto',
    //     categoryURL: '/electronics',
    //     categoryIcon: <IfindIcon icon="chip" className="my-icon" />,

    //     subCategories: [
    //         {
    //             categoryLabel: 'Mobile Phones',
    //             categoryURL: '/electronics/mobilephones',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Portable Audio',
    //             categoryURL: '/electronics/portableaudio',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Home Theater',
    //             categoryURL: '/electronics/hometheater',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //     ]
    // },

    // {
    //     categoryLabel: 'Sonstiges',
    //     categoryURL: '/everythingelse',
    //     categoryIcon: <i className="fa fa-briefcase" aria-hidden="true"></i>,

    //     subCategories: [
    //         {
    //             categoryLabel: 'Test Category',
    //             categoryURL: '/everythingelse/testcategory',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Test Category 2',
    //             categoryURL: '/everythingelse/testcategory2',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //     ]
    // },

    // {
    //     categoryLabel: 'Garten',
    //     categoryURL: '/gardenandoutdoor',
    //     categoryIcon: <IfindIcon icon="flower-shovel" className="my-icon" />,

    //     subCategories: [
    //         {
    //             categoryLabel: 'Test Category',
    //             categoryURL: '/gardenandoutdoor/testcategory',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Test Category 2',
    //             categoryURL: '/gardenandoutdoor/testcategory2',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //     ]
    // },

    // {
    //     categoryLabel: 'Geschenkgutscheine',
    //     categoryURL: '/giftcards',
    //     categoryIcon: <IfindIcon icon="gift-cards" className="my-icon" />,

    //     subCategories: [
    //         {
    //             categoryLabel: 'Test Category',
    //             categoryURL: '/giftcards/testcategory',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Test Category 2',
    //             categoryURL: '/giftcards/testcategory2',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //     ]
    // },

    // {
    //     categoryLabel: 'Lebensmittel & Getränke',
    //     categoryURL: '/groceeyandgourmetfood',
    //     categoryIcon: <IfindIcon icon="dine-house" className="my-icon" />,

    //     subCategories: [
    //         {
    //             categoryLabel: 'Canned Goods',
    //             categoryURL: '/groceeyandgourmetfood/cannedgoods',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Beverages',
    //             categoryURL: '/groceeyandgourmetfood/beverages',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Condiments',
    //             categoryURL: '/groceeyandgourmetfood/condiments',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Snacks',
    //             categoryURL: '/groceeyandgourmetfood/snacks',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //     ]
    // },

    // {
    //     categoryLabel: 'Handmade',
    //     categoryURL: '/handmade',
    //     categoryIcon: <IfindIcon icon="hands-twirl" className="my-icon" />,

    //     subCategories: [
    //         {
    //             categoryLabel: 'Test Category',
    //             categoryURL: '/handmade/testcategory',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Test Category 2',
    //             categoryURL: '/handmade/testcategory2',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //     ]
    // },

    // {
    //     categoryLabel: 'Drogerie & Körperpflege',
    //     categoryURL: '/healthpersonalcare',
    //     categoryIcon: <IfindIcon icon="doctor" className="my-icon" />,

    //     subCategories: [
    //         {
    //             categoryLabel: 'Hand Soap',
    //             categoryURL: '/healthandpersonalcare/handsoap',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Body Wash',
    //             categoryURL: '/healthandpersonalcare/bodywash',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Mens Grooming',
    //             categoryURL: '/healthandpersonalcare/mensgrooming',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //     ]
    // },


    // {
    //     categoryLabel: 'Küche, Haushalt & Wohnen',
    //     categoryURL: '/homeandkitchen',
    //     categoryIcon: <IfindIcon icon="dine-house" className="my-icon" />,

    //     subCategories: [
    //         {
    //             categoryLabel: 'Kitchen Utensils',
    //             categoryURL: '/homeandkitchen/kitchenutensils',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Cookwares',
    //             categoryURL: '/homeandkitchen/cookwares',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'kitchen Appliances',
    //             categoryURL: '/homeandkitchen/kitchenappliances',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //     ]
    // },

    // {
    //     categoryLabel: 'Gewerbe, Industrie & Wissenschaft',
    //     categoryURL: '/industrial',
    //     categoryIcon: <IfindIcon icon="factory-cog" className="my-icon" />,

    //     subCategories: [
    //         {
    //             categoryLabel: 'Construction Materials',
    //             categoryURL: '/industrial/constructionmaterials',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Logistics',
    //             categoryURL: '/industrial/logistics',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //     ]
    // },

    // {
    //     categoryLabel: 'Schmuck',
    //     categoryURL: '/jewelry',
    //     categoryIcon: <IfindIcon icon="necklace-display" className="my-icon" />,

    //     subCategories: [
    //         {
    //             categoryLabel: 'Necklace',
    //             categoryURL: '/jewelry/necklace',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Bracelet',
    //             categoryURL: '/jewelry/bracelet',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Ring',
    //             categoryURL: '/jewelry/ring',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Earrings',
    //             categoryURL: '/jewelry/earrings',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //     ]
    // },

    // {
    //     categoryLabel: 'Sale',
    //     categoryURL: '/sale',
    //     categoryIcon: <IfindIcon icon="sale-tag" className="my-icon" />,

    //     subCategories: [
    //         {
    //             categoryLabel: 'Test Category',
    //             categoryURL: '/sale/testcategory',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Test Category 2',
    //             categoryURL: '/sale/testcategory2',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //     ]
    // },

    // {
    //     categoryLabel: 'Koffer, Rucksäcke & Taschen',
    //     categoryURL: '/luggage',
    //     categoryIcon: <i className="fa fa-suitcase" aria-hidden="true"></i>,

    //     subCategories: [
    //         {
    //             categoryLabel: 'Backpack',
    //             categoryURL: '/luggage/backpack',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Baggage',
    //             categoryURL: '/luggage/baggage',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Briefcase',
    //             categoryURL: '/luggage/briefcase',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //     ]
    // },

    // {
    //     categoryLabel: 'Luxury Beauty',
    //     categoryURL: '/luxurybeauty',
    //     categoryIcon: <IfindIcon icon="ladies-bag" className="my-icon" />,

    //     subCategories: [
    //         {
    //             categoryLabel: 'Test Category',
    //             categoryURL: '/luxurybeauty/testcategory',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Test Category 2',
    //             categoryURL: '/luxurybeauty/testcategory2',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //     ]
    // },

    // {
    //     categoryLabel: 'Apps & Spiele',
    //     categoryURL: '/mobileapps',
    //     categoryIcon: <i className="fa fa-mobile" aria-hidden="true"></i>,

    //     subCategories: [
    //         {
    //             categoryLabel: 'Lifestyle Apps',
    //             categoryURL: '/mobileapps/lifestyle',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Games and Entertainment Apps',
    //             categoryURL: '/mobileapps/gamesandentertainment',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Productivity Apps',
    //             categoryURL: '/mobileapps/productivity',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //     ]
    // },


    // {
    //     categoryLabel: 'DVD & Blu-ray',
    //     categoryURL: '/moviesandtv',
    //     categoryIcon: <IfindIcon icon="play-tv" className="my-icon" />,

    //     subCategories: [
    //         {
    //             categoryLabel: 'Horror',
    //             categoryURL: '/moviesandtv/horros',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Thriller',
    //             categoryURL: '/moviesandtv/thriller',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Love Story',
    //             categoryURL: '/moviesandtv/lovestory',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: '3D Animation',
    //             categoryURL: '/moviesandtv/3danimation',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Sci-Fi',
    //             categoryURL: '/moviesandtv/sci-fi',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //     ]
    // },

    // {
    //     categoryLabel: 'Musik-CDs & Vinyl',
    //     categoryURL: '/music',
    //     categoryIcon: <IfindIcon icon="note" className="my-icon" />,

    //     subCategories: [
    //         {
    //             categoryLabel: 'Pop Rock',
    //             categoryURL: '/music/poprock',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Jazz',
    //             categoryURL: '/music/jazz',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'RNB',
    //             categoryURL: '/music/rnb',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //     ]
    // },

    // {
    //     categoryLabel: 'Musikinstrumente & DJ-Equipment',
    //     categoryURL: '/musicalinstruments',
    //     categoryIcon: <IfindIcon icon="music-instruments" className="my-icon" />,

    //     subCategories: [
    //         {
    //             categoryLabel: 'String Instruments',
    //             categoryURL: '/musicalinstruments/string',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Brass Instruments',
    //             categoryURL: '/musicalinstruments/brass',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Percussion Instruments',
    //             categoryURL: '/musicalinstruments/percussion',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //     ]
    // },

    // {
    //     categoryLabel: 'Bürobedarf & Schreibwaren',
    //     categoryURL: '/officeproducts',
    //     categoryIcon: <IfindIcon icon="table-with-chair" className="my-icon" />,

    //     subCategories: [
    //         {
    //             categoryLabel: 'Office Furniture',
    //             categoryURL: '/officeproducts/officefurniture',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Office Equipment',
    //             categoryURL: '/officeproducts/officeequipment',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //     ]
    // },

    // {
    //     categoryLabel: 'Haustier',
    //     categoryURL: '/petsupplies',
    //     categoryIcon: <IfindIcon icon="paw-circle" className="my-icon" />,

    //     subCategories: [
    //         {
    //             categoryLabel: 'Pet Food',
    //             categoryURL: '/petsupplies/petfood',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Pet Toys',
    //             categoryURL: '/musicalinstruments/pettoys',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //     ]
    // },

    // {
    //     categoryLabel: 'Kamera & Foto',
    //     categoryURL: '/photo',
    //     categoryIcon: <IfindIcon icon="camera" className="my-icon" />,

    //     subCategories: [
    //         {
    //             categoryLabel: 'Portrait',
    //             categoryURL: '/photo/portrait',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Fashion',
    //             categoryURL: '/photo/fashion',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Sports',
    //             categoryURL: '/photo/sports',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //     ]
    // },

    // {
    //     categoryLabel: 'Schuhe & Handtaschen',
    //     categoryURL: '/shoes',
    //     categoryIcon: <IfindIcon icon="shoes" className="my-icon" />,

    //     subCategories: [
    //         {
    //             categoryLabel: 'Mens Shoes',
    //             categoryURL: '/shoes/mensshoes',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Womens Shoes',
    //             categoryURL: '/shoes/womensshoes',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Childrens Shoes',
    //             categoryURL: '/shoes/childrensshoes',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //     ]
    // },

    // {
    //     categoryLabel: 'Software',
    //     categoryURL: '/software',
    //     categoryIcon: <i className="fa fa-th-large" aria-hidden="true"></i>,

    //     subCategories: [
    //         {
    //             categoryLabel: 'System Software',
    //             categoryURL: '/software/system',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Application Software',
    //             categoryURL: '/software/application',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //     ]
    // },

    // {
    //     categoryLabel: 'Sport & Freizeit',
    //     categoryURL: '/sportsandoutdoors',
    //     categoryIcon: <IfindIcon icon="tent-soccer" className="my-icon" />,

    //     subCategories: [
    //         {
    //             categoryLabel: 'Hiking and Camping',
    //             categoryURL: '/sportsandoutdoors/hikingandcamping',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Sports Equipment',
    //             categoryURL: '/sportsandoutdoors/sportequipment',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //     ]
    // },

    // {
    //     categoryLabel: 'Baumarkt',
    //     categoryURL: '/toolsandhomeimprovement',
    //     categoryIcon: <IfindIcon icon="home-build" className="my-icon" />,

    //     subCategories: [
    //         {
    //             categoryLabel: 'Power and Hand Tools',
    //             categoryURL: '/toolsandhomeimprovement/powerandhandtools',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Cleaning Supplies',
    //             categoryURL: '/toolsandhomeimprovement/cleaningsupplies',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Electricals',
    //             categoryURL: '/toolsandhomeimprovement/electricals',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Safety and Security',
    //             categoryURL: '/toolsandhomeimprovement/safetyandsecurity',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //     ]
    // },

    // {
    //     categoryLabel: 'Spielzeug',
    //     categoryURL: '/toysandgames',
    //     categoryIcon: <IfindIcon icon="duck" className="my-icon" />,

    //     subCategories: [
    //         {
    //             categoryLabel: 'Test Category',
    //             categoryURL: '/toysandgames/testcategory',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Test Category 2',
    //             categoryURL: '/toysandgames/testcategory2',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //     ]
    // },

    // {
    //     categoryLabel: 'VHS',
    //     categoryURL: '/vhs',
    //     categoryIcon: <IfindIcon icon="console" className="my-icon" />,

    //     subCategories: [
    //         {
    //             categoryLabel: 'Test Category',
    //             categoryURL: '/vhs/testcategory',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Test Category 2',
    //             categoryURL: '/vhs/testcategory2',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //     ]
    // },

    // {
    //     categoryLabel: 'Games',
    //     categoryURL: '/videogames',
    //     categoryIcon: <IfindIcon icon="controller" className="my-icon" />,

    //     subCategories: [
    //         {
    //             categoryLabel: 'Test Category',
    //             categoryURL: '/videogames/testcategory',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Test Category 2',
    //             categoryURL: '/videogames/testcategory2',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //     ]
    // },

    // {
    //     categoryLabel: 'Uhren',
    //     categoryURL: '/watches',
    //     categoryIcon: <IfindIcon icon="watch" className="my-icon" />,

    //     subCategories: [
    //         {
    //             categoryLabel: 'Test Category',
    //             categoryURL: '/watches/testcategory',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //         {
    //             categoryLabel: 'Test Category 2',
    //             categoryURL: '/watches/testcategory2',
    //             //categoryIcon: <IoIcons.IoIosPaper />
    //         },
    //     ]
    // },
];