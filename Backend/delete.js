const { PrismaClient } = require("@prisma/client"); 
const p = new PrismaClient(); 
p.user.deleteMany({
  where: {
    email: {
      in: ["msiacc99@gmail.com", "nitrogoku3m@gmail.com"]
    }
  }
}).then(r => console.log("Deleted:", r.count)).catch(console.error).finally(()=>p.$disconnect());
