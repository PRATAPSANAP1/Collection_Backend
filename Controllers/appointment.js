const parlor=require("../Model/beauty");

// Add this constant to the top of Controller/appointment.js
const SERVICE_DURATIONS = {
    'Facial': 90, // 90 minutes
    'Waxing': 60,  // 60 minutes
    'Manicure': 45, // 45 minutes
    'Pedicure': 45, // 45 minutes
    'Hair Cut': 60, // 60 minutes
    'Hair Styling': 90, // 90 minutes
    'Bridal Makeup': 180, // 3 hours
    'Other': 60 // Default to 1 hour
};

// const getData=async (req,res)=>{
//     const body=req.body;
//     try{
//         const target=await parlor.create({
//             Name:body.Name,
//             Email:req.user.email,
//             Contact_Number:body.Contact_Number,
//             Service:body.Service,
//             Beautician:body.Beautician,
//             Date:body.Date,
//             Time:body.Time,
//             Message:body.Message,
//             Status:body.Status
//         })

//         res.send(`Appointment added for ${body.Service} service`);
//     }catch(err)
//     {
//         console.log("error of parlor : ",err);
//         res.send("Unable to add appointment ! Try again later");
//     }
// }

const getData = async (req, res) => {
    const body = req.body;
    
    // --- New Collision Logic ---
    try {
        const appointmentDate = new Date(body.Date);
        const [hour, minute] = body.Time.split(':').map(Number);
        
        // Convert booking time to a single date/time object for easy comparison
        const requestedStart = new Date(appointmentDate);
        requestedStart.setHours(hour, minute, 0, 0);

        const durationMinutes = SERVICE_DURATIONS[body.Service] || SERVICE_DURATIONS['Other'];
        const requestedEnd = new Date(requestedStart.getTime() + durationMinutes * 60000); // Add duration in milliseconds

        // 1. Check for collision with existing appointments (must be on same date/beautician)
        const existingAppointments = await parlor.find({
            Date: body.Date, // MongoDB typically stores Date as string for exact match
            Beautician: body.Beautician,
            Status: { $ne: 'Cancelled' } // Only check against non-cancelled appointments
        });

        const isCollision = existingAppointments.some(existingApp => {
            const [existingHour, existingMinute] = existingApp.Time.split(':').map(Number);

            const existingStart = new Date(appointmentDate);
            existingStart.setHours(existingHour, existingMinute, 0, 0);

            const existingDuration = SERVICE_DURATIONS[existingApp.Service] || SERVICE_DURATIONS['Other'];
            const existingEnd = new Date(existingStart.getTime() + existingDuration * 60000);

            // Collision check: [A_start < B_end] AND [A_end > B_start]
            return (requestedStart.getTime() < existingEnd.getTime()) && 
                   (requestedEnd.getTime() > existingStart.getTime());
        });

        if (isCollision) {
            return res.status(409).send("Time slot unavailable. Please choose another time.");
        }

        // 2. Check if the booking is outside of working hours (9 AM to 8 PM)
        const startHour = requestedStart.getHours();
        // Check if starting time is between 9:00 and the time such that the service finishes before 20:00 (8 PM)
        if (startHour < 9 || (requestedEnd.getHours() > 20 || (requestedEnd.getHours() === 20 && requestedEnd.getMinutes() > 0))) {
            return res.status(400).send("Appointments are only available between 9 AM and 8 PM.");
        }
        
        // If no collision and within hours, proceed with saving the new appointment
        const target = await parlor.create({
            Name: body.Name,
            Email: req.user.email,
            Contact_Number: body.Contact_Number,
            Service: body.Service,
            Beautician: body.Beautician,
            Date: body.Date,
            Time: body.Time,
            Message: body.Message,
            Status: body.Status
        });

        res.send(`Appointment added for ${body.Service} service`);

    } catch (err) {
        console.log("error of parlor : ", err);
        // Better error handling for missing service or internal server error
        if (!SERVICE_DURATIONS[body.Service]) {
             return res.status(400).send("Invalid service selected.");
        }
        res.status(500).send("Unable to add appointment! Try again later.");
    }
}


const sendData=async (req,res)=>{
    try{
        const data=await parlor.find({});
    res.json(data);
    }catch(err)
    {
        console.log("app error:",err);
        res.json({"message":err});
    }
    
}

const sendApp=async (req,res)=>{
    
    const data=await parlor.find({Email:req.user.email});
    res.json(data);
}

const updateStatus=async (req,res)=>{
    const body=req.body;
    try{
        const target=await parlor.findByIdAndUpdate(
            body.id,
            {Status:"Completed"},
            {new:true}
        );
        res.send("Status updated successfully");

    }catch(err)
    {
        res.send(err);
    }  
}

const updateBeautician=async (req,res)=>{
    const body=req.body;
    console.log("parlaorB : ",body);
    try{
        const target=await parlor.findByIdAndUpdate(
            body.id,
            {Beautician:body.Beautician},
            {new:true}
        );
        res.send("Beautician name set successfully");

    }catch(err)
    {
        res.send("Unable to set the beautician !");
    }
}  



module.exports = {
    getData,
    sendData,
    updateStatus,
    updateBeautician,
    sendApp
}