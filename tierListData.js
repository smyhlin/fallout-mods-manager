// tierListData.js

window.armorTierListData = [
  {
    tierNameKey: "tierListTierS",
    tierColor: "var(--tier-s-color)",
    tierBorderColor: "var(--tier-s-border-color)",
    textColor: "var(--tier-s-text-color)",
    categories: [
      {
        categoryNameKey: "tierListCategoryPower",
        modules: [
          // Assuming "Неудержимость" (Limit Breaking) for VATS
          { id: "WIP4_LegendaryShard_Shared4_LimitBreak", noteKey: "tierListNoteVATS" },
          // "Обновление" -> Rejuvenator's
          { id: "WIP4_LegendaryShard_Armor4_Rejuvenators", noteKey: "tierListNotePreFix" },
          // "Рейнджерский" -> Ranger's
          { id: "WIP4_LegendaryShard_Shared4_Ranger", noteKey: "tierListNoteNoVATSAfterFix" },
          // "Неудержимость" (Limit Breaking) for Full HP + VATS
          { id: "WIP4_LegendaryShard_Shared4_LimitBreak", noteKey: "tierListNoteFullHpVATS" },
        ]
      },
      {
        categoryNameKey: "tierListCategoryRegular",
        modules: [
          // "Хирургия" -> Sawbones's
          { id: "WIP4_LegendaryShard_Shared4_Sawbones", noteKey: "tierListNoteLowHp" },
          // "Неудержимость + рендж/хир" - This is complex. Representing "Неудержимость" (Limit Breaking)
          // The note implies combination, which is a build strategy, not a single module.
          // For simplicity, listing Limit Breaking and user can infer combinations.
          { id: "WIP4_LegendaryShard_Shared4_LimitBreak", noteKey: "tierListNoteLowHp" },
        ]
      }
    ]
  },
  {
    tierNameKey: "tierListTierA",
    tierColor: "var(--tier-a-color)",
    tierBorderColor: "var(--tier-a-border-color)",
    textColor: "var(--tier-a-text-color)",
    categories: [
      {
        categoryNameKey: "tierListCategoryPower",
        modules: [
          { id: "WIP4_LegendaryShard_Armor4_Rejuvenators", noteKey: "tierListNoteAfterFix" }, // Обновление
          { id: "WIP4_LegendaryShard_Armor4_Reflective" }, // Отражающий
          { id: "WIP4_LegendaryShard_Shared4_Ranger" },    // Рейнджерский
          { id: "WIP4_LegendaryShard_Armor4_Scanners" },   // Сканирующий
          { id: "WIP4_LegendaryShard_Shared4_Tanky" },     // Стойкость
          { id: "WIP4_LegendaryShard_Armor4_Aegis" },      // Укрывание
          { id: "WIP4_LegendaryShard_Armor4_RadioactivePowered" }, // Ядерно-энергетический
        ]
      },
      {
        categoryNameKey: "tierListCategoryRegular",
        modules: [
          { id: "WIP4_LegendaryShard_Shared4_Ranger" }, // Рейнджерский
          { id: "WIP4_LegendaryShard_Shared4_Tanky" },  // Стойкость
        ]
      }
    ]
  },
  {
    tierNameKey: "tierListTierF",
    tierColor: "var(--tier-f-color)",
    tierBorderColor: "var(--tier-f-border-color)",
    textColor: "var(--tier-f-text-color)",
    categories: [
      {
        categoryNameKey: "tierListCategoryEverywhere",
        modules: [
          { id: "WIP4_LegendaryShard_Shared4_Bruiser" }, // Боксерский
          { id: "WIP4_LegendaryShard_Shared4_Miasma" },  // Зловонный
          { id: "WIP4_LegendaryShard_Shared4_Runner" },  // Курьерский
          { id: "WIP4_LegendaryShard_Armor4_Stalwarts" },// Несгибаемость
          { id: "WIP4_LegendaryShard_Shared4_BattleLoaders" }, // Погрузочный
          { id: "WIP4_LegendaryShard_Armor4_Propelling" }, // Форсирующий
          { id: "WIP4_LegendaryShard_Armor4_ChooChoo" },   // Чух-чух
        ]
      }
    ]
  }
];

window.weaponTierListData = [
  {
    tierNameKey: "tierListTierS",
    tierColor: "var(--tier-s-color)",
    tierBorderColor: "var(--tier-s-border-color)",
    textColor: "var(--tier-s-text-color)",
    categories: [
      {
        categoryNameKey: "tierListCategoryGeneral",
        modules: [
          // "Филигранность" -> Pin-Pointer's
          { id: "WIP4_LegendaryShard_Weapon4_Guns_PinPointers", noteKey: "tierListNoteNowAndAfterFix" },
          // "Колотушка" -> Pounder's
          { id: "WIP4_LegendaryShard_Weapon4_Melee_Pounders" },
          // "Задиристый" -> Bully's
          { id: "WIP4_LegendaryShard_Weapon4_Bully", noteKey: "tierListNoteAfterFixes" },
          // "Полированный" -> Polished
          { id: "WIP4_LegendaryShard_Weapon4_Polished", noteKey: "tierListNoteExplosiveOnly" },
        ]
      }
    ]
  },
  {
    tierNameKey: "tierListTierA",
    tierColor: "var(--tier-a-color)",
    tierBorderColor: "var(--tier-a-border-color)",
    textColor: "var(--tier-a-text-color)",
    categories: [
      {
        categoryNameKey: "tierListCategoryGeneral",
        modules: [
          { id: "WIP4_LegendaryShard_Weapon4_Vipers" },       // Гадючий
          { id: "WIP4_LegendaryShard_Weapon4_Pyromaniac" },   // Пироманский
          { id: "WIP4_LegendaryShard_Weapon4_Polished" },     // Полированный
          { id: "WIP4_LegendaryShard_Weapon4_Conductors" },   // Проводник
          { id: "WIP4_LegendaryShard_Weapon4_Melee_Fencers" },// Фехтование
          { id: "WIP4_LegendaryShard_Weapon4_Guns_Electricians" }, // Электротехнический
        ]
      }
    ]
  },
  {
    tierNameKey: "tierListTierF",
    tierColor: "var(--tier-f-color)",
    tierBorderColor: "var(--tier-f-border-color)",
    textColor: "var(--tier-f-text-color)",
    categories: [
      {
        categoryNameKey: "tierListCategoryGeneral",
        modules: [
          { id: "WIP4_LegendaryShard_Weapon4_Encirclers" },      // Жатва
          { id: "WIP4_LegendaryShard_Weapon4_Bully", noteKey: "tierListNoteNowBeforeFiligreeFix" }, // Задиристый
          { id: "WIP4_LegendaryShard_Weapon4_Fracturers" },     // Костоломный
          { id: "WIP4_LegendaryShard_Weapon4_Melee_ComboBreaker" },// Сокрушающий
          { id: "WIP4_LegendaryShard_Weapon4_Guns_Stabilizers" },// Стабилизатор
          { id: "WIP4_LegendaryShard_Weapon4_Melee_Icemens" },   // Хладнокровный
        ]
      }
    ]
  }
];