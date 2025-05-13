// tierListData.js

// --- Armor Tier List Data ---
window.armorTierListData = [
  {
    tierNameKey: "tierListTierS",
    tierColor: "var(--tier-s-color)",
    tierBorderColor: "var(--tier-s-border-color)",
    textColor: "var(--tier-s-text-color)", // Added
    categories: [
      {
        categoryNameKey: "tierListCategoryPower",
        modules: [
          { name: "Неудержимость", noteKey: "tierListNoteVATS" },
          { name: "Обновление", noteKey: "tierListNotePreFix" },
          { name: "Рейнджерский", noteKey: "tierListNoteNoVATSAfterFix" },
          { name: "Неудержимость", noteKey: "tierListNoteFullHpVATS" },
        ]
      },
      {
        categoryNameKey: "tierListCategoryRegular",
        modules: [
          { name: "Хирургия", noteKey: "tierListNoteLowHp" },
          { name: "Неудержимость + рендж/хир", noteKey: "tierListNoteLowHp" },
        ]
      }
    ]
  },
  {
    tierNameKey: "tierListTierA",
    tierColor: "var(--tier-a-color)",
    tierBorderColor: "var(--tier-a-border-color)",
    textColor: "var(--tier-a-text-color)", // Added
    categories: [
      {
        categoryNameKey: "tierListCategoryPower",
        modules: [
          { name: "Обновление", noteKey: "tierListNoteAfterFix" },
          { name: "Отражающий" },
          { name: "Рейнджерский" },
          { name: "Сканирующий" },
          { name: "Стойкость" },
          { name: "Укрывание" },
          { name: "Ядерно-энергетический" },
        ]
      },
      {
        categoryNameKey: "tierListCategoryRegular",
        modules: [
          { name: "Рейнджерский" },
          { name: "Стойкость" },
        ]
      }
    ]
  },
  {
    tierNameKey: "tierListTierF",
    tierColor: "var(--tier-f-color)",
    tierBorderColor: "var(--tier-f-border-color)",
    textColor: "var(--tier-f-text-color)", // Added
    categories: [
      {
        categoryNameKey: "tierListCategoryEverywhere",
        modules: [
          { name: "Боксерский" },
          { name: "Зловонный" },
          { name: "Курьерский" },
          { name: "Несгибаемость" },
          { name: "Погрузочный" },
          { name: "Форсирующий" },
          { name: "Чух-чух" },
        ]
      }
    ]
  }
];

// --- Weapon Tier List Data ---
window.weaponTierListData = [
  {
    tierNameKey: "tierListTierS",
    tierColor: "var(--tier-s-color)",
    tierBorderColor: "var(--tier-s-border-color)",
    textColor: "var(--tier-s-text-color)", // Added
    categories: [
      {
        categoryNameKey: "tierListCategoryGeneral", 
        modules: [
          { name: "Филигранность", noteKey: "tierListNoteNowAndAfterFix" },
          { name: "Колотушка" },
          { name: "Задиристый", noteKey: "tierListNoteAfterFixes" },
          { name: "Полированный", noteKey: "tierListNoteExplosiveOnly" },
        ]
      }
    ]
  },
  {
    tierNameKey: "tierListTierA",
    tierColor: "var(--tier-a-color)",
    tierBorderColor: "var(--tier-a-border-color)",
    textColor: "var(--tier-a-text-color)", // Added
    categories: [
      {
        categoryNameKey: "tierListCategoryGeneral",
        modules: [
          { name: "Гадючий" },
          { name: "Пироманский" },
          { name: "Полированный" },
          { name: "Проводник" },
          { name: "Фехтование" },
          { name: "Электротехнический" },
        ]
      }
    ]
  },
  {
    tierNameKey: "tierListTierF",
    tierColor: "var(--tier-f-color)",
    tierBorderColor: "var(--tier-f-border-color)",
    textColor: "var(--tier-f-text-color)", // Added
    categories: [
      {
        categoryNameKey: "tierListCategoryGeneral",
        modules: [
          { name: "Жатва" },
          { name: "Задиристый", noteKey: "tierListNoteNowBeforeFiligreeFix" },
          { name: "Костоломный" },
          { name: "Сокрушающий" },
          { name: "Стабилизатор" },
          { name: "Хладнокровный" },
        ]
      }
    ]
  }
];