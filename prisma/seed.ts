import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const ROOMS = [
  {
    name: "Superior Room",
    description:
      "A bright, understated room shaped by warm materials and calm views, ideal for a quiet stay in the countryside.",
    type: "Superior",
    capacity: 2,
    size: 28,
    basePrice: 180,
    bedType: "King Bed",
    images: ["/images/rooms/oda1.jpg"],
    amenities: ["Wi-Fi", "Air Conditioning", "Breakfast", "Minibar"],
  },
  {
    name: "Deluxe Room",
    description:
      "A more spacious room with a private sitting area, dressed in soft linens and locally sourced furniture.",
    type: "Deluxe",
    capacity: 2,
    size: 35,
    basePrice: 240,
    bedType: "King Bed",
    images: ["/images/rooms/oda2.jpg"],
    amenities: [
      "Wi-Fi",
      "Air Conditioning",
      "Breakfast",
      "Minibar",
      "Bathtub",
    ],
  },
  {
    name: "Junior Suite",
    description:
      "A generous suite with a separate living area, opening onto the olive groves for a longer, unhurried stay.",
    type: "Suite",
    capacity: 3,
    size: 48,
    basePrice: 320,
    bedType: "King Bed",
    images: ["/images/rooms/oda3.jpg"],
    amenities: [
      "Wi-Fi",
      "Air Conditioning",
      "Breakfast",
      "Minibar",
      "Bathtub",
      "Terrace",
    ],
  },
  {
    name: "Aurelia Suite",
    description:
      "Our signature suite: the largest and most private room at AURELIA, with panoramic countryside views and a dedicated lounge.",
    type: "Suite",
    capacity: 4,
    size: 65,
    basePrice: 480,
    bedType: "King Bed",
    images: ["/images/rooms/oda4.jpg"],
    amenities: [
      "Wi-Fi",
      "Air Conditioning",
      "Breakfast",
      "Minibar",
      "Bathtub",
      "Terrace",
      "Fireplace",
    ],
  },
];

async function main() {
  // Room.name isn't a unique column, so upsert isn't available — look the
  // room up by name first to keep re-running this script idempotent.
  for (const room of ROOMS) {
    const existing = await prisma.room.findFirst({
      where: { name: room.name },
    });

    if (existing) {
      await prisma.room.update({ where: { id: existing.id }, data: room });
    } else {
      await prisma.room.create({ data: room });
    }
  }
  console.log(`Seeded ${ROOMS.length} rooms.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
