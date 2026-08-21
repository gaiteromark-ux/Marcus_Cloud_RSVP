/*
  FRONTEND CONFIGURATION
  Only the Apps Script WEB APP URL belongs here.
  Never put your Google Sheet ID, API key, service-account key,
  or password here.
*/

const APP_CONFIG = {

  // Google Apps Script Web App
  APPS_SCRIPT_WEB_APP_URL:
    "https://script.google.com/macros/s/AKfycbyKYTZoPJqJselnj55UAVkv05heA0MQRrp9IeDv9HbOR5IES41c81nTqk7QC8HbKT2I3Q/exec",

  // Child
  childName: "Marcus Cloud Gaitero",

  // Event
  eventDateISO: "2026-09-29T11:00:00+08:00",

  // Organizer
  organizerPhone: "+639647544914",

  // Online registry link
  // Put your Shopee/Lazada/Amazon/etc. registry link here.
  giftRegistryUrl: "",

  // Gift list
  giftList: [
    {
      icon: "💌",
      name: "Cash Gift",
      description: "For Marcus's future needs and little dreams."
    },
    {
      icon: "👕",
      name: "Baby Clothes",
      description: "Comfortable clothes for Marcus."
    },
    {
      icon: "🧸",
      name: "Toys & Books",
      description: "Age-appropriate toys, books, and learning materials."
    },
    {
      icon: "🍼",
      name: "Baby Essentials",
      description: "Useful everyday baby essentials."
    },
    {
      icon: "🧴",
      name: "Baby Care",
      description: "Baby care and hygiene products."
    }
 ],

   // Google Drive Photo Gallery
  photoGalleryUrl:
    "https://drive.google.com/drive/folders/1US1PMHg5F03pwFPquPSyFH6u_lOon9ko?usp=drive_link"
};
