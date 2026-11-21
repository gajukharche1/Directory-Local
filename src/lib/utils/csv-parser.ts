/**
 * Multi-Entity CSV Parser & Pre-flight Validator
 * Handles Listings, Categories, and Locations with delimiter sniffing,
 * quoted text support, header normalization, and line-by-line error diagnostics.
 */

export type ImportEntityType = "listings" | "categories" | "locations";

export interface ParsedRowError {
  rowNumber: number;
  field: string;
  message: string;
}

export interface ParsedCsvResult<T = Record<string, any>> {
  headers: string[];
  rows: Array<{
    rowNumber: number;
    data: T;
    isValid: boolean;
    errors: ParsedRowError[];
  }>;
  validCount: number;
  invalidCount: number;
  totalCount: number;
}

/**
 * Robust CSV line tokenizer respecting quotes and escaped quotes
 */
export function parseCsvText(text: string, delimiter = ","): string[][] {
  const lines: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++; // Skip escaped quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === delimiter) {
        currentRow.push(currentField.trim());
        currentField = "";
      } else if (char === "\r") {
        // Ignore carriage return
      } else if (char === "\n") {
        currentRow.push(currentField.trim());
        if (currentRow.some((f) => f.length > 0)) {
          lines.push(currentRow);
        }
        currentRow = [];
        currentField = "";
      } else {
        currentField += char;
      }
    }
  }

  // Push last field & row if remaining
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((f) => f.length > 0)) {
      lines.push(currentRow);
    }
  }

  return lines;
}

/**
 * Sniffs the primary delimiter from the first header line
 */
export function detectDelimiter(text: string): string {
  const firstLine = text.split(/\r?\n/)[0] || "";
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;

  if (semicolonCount > commaCount && semicolonCount > tabCount) return ";";
  if (tabCount > commaCount && tabCount > semicolonCount) return "\t";
  return ",";
}

/**
 * Normalizes header strings (strips whitespace, lowercase, maps aliases)
 */
function normalizeHeader(h: string): string {
  const clean = h.toLowerCase().trim().replace(/['"_\s-]+/g, "");
  if (clean === "businessname" || clean === "name" || clean === "listingname") return "title";
  if (clean === "categoryname" || clean === "categoryslug") return "category";
  if (clean === "locationname" || clean === "locationslug") return "location";
  if (clean === "phonenumber" || clean === "mobile") return "phone";
  if (clean === "whatsappnumber") return "whatsapp";
  if (clean === "emailaddress") return "email";
  if (clean === "websiteurl") return "website";
  if (clean === "streetaddress" || clean === "fulladdress") return "address";
  if (clean === "operatinghours" || clean === "timings" || clean === "hours") return "openinghours";
  if (clean === "parentcategory" || clean === "parentlocation" || clean === "parentslug") return "parent";
  if (clean === "featured" || clean === "isfeatured" || clean === "featuredonhome") return "featured";
  return clean;
}

/**
 * Pre-flight client-side parser & validator
 */
export function validateCsvInput(
  rawCsv: string,
  entityType: ImportEntityType
): ParsedCsvResult {
  const delimiter = detectDelimiter(rawCsv);
  const rawLines = parseCsvText(rawCsv, delimiter);

  if (rawLines.length === 0) {
    return { headers: [], rows: [], validCount: 0, invalidCount: 0, totalCount: 0 };
  }

  const rawHeaders = rawLines[0] || [];
  const normalizedHeaders = rawHeaders.map(normalizeHeader);

  const results: ParsedCsvResult["rows"] = [];
  let validCount = 0;
  let invalidCount = 0;

  for (let i = 1; i < rawLines.length; i++) {
    const values = rawLines[i] || [];
    const rowData: Record<string, any> = {};
    const rowErrors: ParsedRowError[] = [];
    const rowNumber = i + 1;

    normalizedHeaders.forEach((headerKey, idx) => {
      rowData[headerKey] = values[idx] !== undefined ? values[idx] : "";
    });

    // Validation rules per entity
    if (entityType === "listings") {
      if (!rowData.title?.trim()) {
        rowErrors.push({ rowNumber, field: "title", message: "Business name / title is required." });
      }
      if (!rowData.address?.trim()) {
        rowErrors.push({ rowNumber, field: "address", message: "Postal address is required." });
      }
      if (rowData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rowData.email.trim())) {
        rowErrors.push({ rowNumber, field: "email", message: "Invalid email format." });
      }
      if (rowData.pricerange && (isNaN(Number(rowData.pricerange)) || Number(rowData.pricerange) < 1 || Number(rowData.pricerange) > 4)) {
        rowErrors.push({ rowNumber, field: "priceRange", message: "Price range must be between 1 and 4." });
      }
    } else if (entityType === "categories") {
      const name = rowData.name || rowData.title;
      if (!name?.trim()) {
        rowErrors.push({ rowNumber, field: "name", message: "Category name is required." });
      }
    } else if (entityType === "locations") {
      const name = rowData.name || rowData.title;
      if (!name?.trim()) {
        rowErrors.push({ rowNumber, field: "name", message: "Location name is required." });
      }
      if (rowData.latitude && isNaN(Number(rowData.latitude))) {
        rowErrors.push({ rowNumber, field: "latitude", message: "Latitude must be a valid number." });
      }
      if (rowData.longitude && isNaN(Number(rowData.longitude))) {
        rowErrors.push({ rowNumber, field: "longitude", message: "Longitude must be a valid number." });
      }
    }

    const isValid = rowErrors.length === 0;
    if (isValid) validCount++;
    else invalidCount++;

    results.push({
      rowNumber,
      data: rowData,
      isValid,
      errors: rowErrors,
    });
  }

  return {
    headers: rawHeaders,
    rows: results,
    validCount,
    invalidCount,
    totalCount: results.length,
  };
}

/**
 * Downloadable sample CSV templates and demo data
 */
export const SAMPLE_TEMPLATES: Record<ImportEntityType, string> = {
  listings: `title,category,locality,address,openingHours,phone,email,website,priceRange,description
Saudagar Fitness Hub,gyms-fitness,Pimple Saudagar,"Shop 14, Rainbow Plaza, Shivar Chowk Rd",Daily: 6 AM – 10 PM,9876543210,info@saudagarfit.com,https://saudagarfit.com,2,Premier fitness club and gym with certified trainers.
Kunal Sweets & Snacks,restaurants-cafes,Kunal Icon Road,"Shop 3, Kunal Icon Rd, Opposite Roseland",Daily: 8 AM – 10 PM,9823001122,order@kunalsweets.com,https://kunalsweets.com,1,Traditional Indian sweets snacks and fresh daily savories.
Dr. Smile Dental Care,healthcare,Kokane Chowk,"Office 201, Vision 9 Mall, Kokane Chowk",Mon-Sat: 9:30 AM – 8:30 PM,9922334455,contact@drsmilecare.com,https://drsmilecare.com,2,Multi-specialty advanced dental care orthodontics and implants.
24x7 MedPlus Pharmacy,healthcare,Shivar Chowk,Near Shivar Chowk,Daily: 12 AM – 11:59 PM,9123456789,shivar@medplusindia.com,https://medplusindia.com,2,24 hours all-night retail pharmacy with emergency home delivery.
Green Earth Plant Nursery,home-services,Govind Garden Area,"Govind Garden Area, Near Linear Garden",Mon-Sat: 9 AM – 7 PM,9123456788,hello@greenearthnursery.in,,1,Exotic indoor plants landscaping design and organic gardening essentials.`,

  categories: `name,slug,parent,description,featured,sortOrder
Healthcare & Hospitals,healthcare,,Top-tier hospitals clinics diagnostic centers and healthcare labs,true,1
Dentists & Dental Clinics,dentists,healthcare,Orthodontics dental implants teeth whitening and cosmetic surgery,true,2
Pharmacies & Chemists,pharmacies,healthcare,24x7 chemist shops prescription medicines and surgical supplies,false,3
Cafes & Coffee Roasters,cafes,food-dining,Specialty roasted espresso cold brews artisanal cakes and breakfast,true,4`,

  locations: `name,slug,parent,latitude,longitude,featured,description
Pimple Saudagar,pimple-saudagar,,18.5987,73.7978,true,Vibrant residential and commercial suburb known for Kunal Icon and high-growth shopping hubs.
Shivar Chowk,shivar-chowk,pimple-saudagar,18.5995,73.7990,true,Major dining and lifestyle avenue featuring premier family restaurants and commercial plazas.
Kokane Chowk,kokane-chowk,pimple-saudagar,18.5975,73.7955,false,High-footfall transportation crossroads with local grocery marts, banking branches and clinics.`,
};

/**
 * Generates and triggers browser download for sample CSV
 */
export function downloadSampleCsv(entityType: ImportEntityType) {
  const content = SAMPLE_TEMPLATES[entityType];
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `sample-${entityType}-template.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
