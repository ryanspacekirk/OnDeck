/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const types = ['shift', 'replacement_needed', 'pending_replacement'];

const shifts = [{start: '2022-12-23 00:00:00', end: '2022-12-23 08:00:00'}, {start: '2022-12-23 08:00:00', end: '2022-12-23 16:00:00'}, 
{start: '2022-12-23 16:00:00', end: '2022-12-24 00:00:00'},{start: '2022-12-24 00:00:00', end: '2022-12-24 08:00:00'},
{start: '2022-12-24 08:00:00', end: '2022-12-24 16:00:00'},{start: '2022-12-24 16:00:00', end: '2022-12-25 00:00:00'},
{start: '2022-12-25 00:00:00', end: '2022-12-25 08:00:00'},{start: '2022-12-25 08:00:00', end: '2022-12-25 16:00:00'},
{start: '2022-12-25 16:00:00', end: '2022-12-26 00:00:00'},{start: '2022-12-26 00:00:00', end: '2022-12-26 08:00:00'},

{start: '2022-12-19 00:00:00', end: '2022-12-19 08:00:00'}, {start: '2022-12-19 08:00:00', end: '2022-12-19 16:00:00'},
{start: '2022-12-19 16:00:00', end: '2022-12-20 00:00:00'}, {start: '2022-12-20 00:00:00', end: '2022-12-20 08:00:00'},
{start: '2022-12-20 08:00:00', end: '2022-12-20 16:00:00'}, {start: '2022-12-20 16:00:00', end: '2022-12-21 00:00:00'},
{start: '2022-12-21 00:00:00', end: '2022-12-21 08:00:00'}, {start: '2022-12-21 08:00:00', end: '2022-12-21 16:00:00'},
{start: '2022-12-21 16:00:00', end: '2022-12-22 00:00:00'}, {start: '2022-12-22 00:00:00', end: '2022-12-22 08:00:00'},
{start: '2022-12-22 08:00:00', end: '2022-12-22 16:00:00'}, {start: '2022-12-22 16:00:00', end: '2022-12-23 00:00:00'},

{start: '2022-12-18 00:00:00', end: '2022-12-18 08:00:00'},
{start: '2022-12-18 08:00:00', end: '2022-12-18 16:00:00'}, 
{start: '2022-12-18 16:00:00', end: '2022-12-19 00:00:00'},
{start: '2022-12-01 00:00:00', end: '2022-12-01 08:00:00'},



];

exports.seed = async function(knex) {

  let memberList = await knex.select('id', 'crew_position_id').from('users').where('role', 'member');
  let memberIndex = 0;

  const getMember = async (crew) =>{
    let tempMember = memberList[memberIndex + (crew * 3)];
    memberIndex++;
    if(memberIndex === 3){
      memberIndex = 0;
    }
    
    return tempMember;

  }

  

  const createTime_Slot = async(crew, shiftID, typeID) => {
    let tempMemberInsert = await getMember(crew);

    let time_slot = {
      start_datetime: shifts[shiftID].start,
      end_datetime: shifts[shiftID].end,
      type:types[typeID],
      description:'Default',
      user_id:tempMemberInsert.id,
      crew_position_id:tempMemberInsert.crew_position_id,
      created_at:knex.fn.now() ,
      updated_at:knex.fn.now()  
    }




    return time_slot;

  }


  // Deletes ALL existing entries
  await knex('time_slots').del()
  await knex('time_slots').insert([
    //A sequence of three time slots reprsents a crew getting assigned one shift. 
    //The first value relates to what shift, the second initalizes the type
    //CREW | SHIFT | TYPE



         //Bravo crew Saturday Night
         await createTime_Slot(1, 22, 0),
         await createTime_Slot(1, 22, 0),
         await createTime_Slot(1, 22, 0),
     
         //Charlie crew Sunday Morning
         await createTime_Slot(2, 23, 0),
         await createTime_Slot(2, 23, 0),
         await createTime_Slot(2, 23, 0),
     
         //Alpha crew Sunday Afternoon
         await createTime_Slot(0, 24, 0),
         await createTime_Slot(0, 24, 0),
         await createTime_Slot(0, 24, 0),




     //Foxtrot crew Sunday Night
  await createTime_Slot(5, 10, 0),
  await createTime_Slot(5, 10, 0),
  await createTime_Slot(5, 10, 0),

  //Echo crew Monday Morning
  await createTime_Slot(4, 11, 0),
  await createTime_Slot(4, 11, 0),
  await createTime_Slot(4, 11, 0),

  //Delta crew Monday Afternoon
  await createTime_Slot(3, 12, 0),
  await createTime_Slot(3, 12, 0),
  await createTime_Slot(3, 12, 0),


     //Foxtrot crew Monday Night
  await createTime_Slot(5, 13, 0),
  await createTime_Slot(5, 13, 0),
  await createTime_Slot(5, 13, 0),

  //Echo crew Tuesday Morning
  await createTime_Slot(4, 14, 0),
  await createTime_Slot(4, 14, 0),
  await createTime_Slot(4, 14, 0),

  //Delta crew Tuesday Afternoon
  await createTime_Slot(3, 15, 0),
  await createTime_Slot(3, 15, 0),
  await createTime_Slot(3, 15, 0),




     //Foxtrot crew Tuesday Night
  await createTime_Slot(5, 16, 0),
  await createTime_Slot(5, 16, 0),
  await createTime_Slot(5, 16, 0),

  //Echo crew Wednesday Morning
  await createTime_Slot(4, 17, 0),
  await createTime_Slot(4, 17, 0),
  await createTime_Slot(4, 17, 0),

  //Delta crew Wednesday Afternoon
  await createTime_Slot(3, 18, 0),
  await createTime_Slot(3, 18, 0),
  await createTime_Slot(3, 18, 0),



  //Foxtrot crew Wednesday Night
  await createTime_Slot(5, 19, 0),
  await createTime_Slot(5, 19, 0),
  await createTime_Slot(5, 19, 0),

  //Echo crew Thursday Morning
  await createTime_Slot(4, 20, 0),
  await createTime_Slot(4, 20, 0),
  await createTime_Slot(4, 20, 0),

  //Delta crew Thursday Afternoon
  await createTime_Slot(3, 21, 0),
  await createTime_Slot(3, 21, 0),
  await createTime_Slot(3, 21, 0),




//////////////////////////////////////


    //Alpha crew Thursday Night
    await createTime_Slot(0, 0, 0),
    await createTime_Slot(0, 0, 0),
    await createTime_Slot(0, 0, 0),

    //Bravo crew Friday Morning
    await createTime_Slot(1, 1, 0),
    await createTime_Slot(1, 1, 0),
    await createTime_Slot(1, 1, 0),

    //Charlie crew Friday Afternoon
    await createTime_Slot(2, 2, 1),
    await createTime_Slot(2, 2, 0),
    await createTime_Slot(2, 2, 0),

    //Alpha crew Friday Night
    await createTime_Slot(0, 3, 0),
    await createTime_Slot(0, 3, 0),
    await createTime_Slot(0, 3, 0),

    //Bravo crew Saturnday Morning
    await createTime_Slot(1, 4, 2),
    await createTime_Slot(1, 4, 0),
    await createTime_Slot(1, 4, 0),

    //Charlie crew Saturday Afternoon
    await createTime_Slot(2, 5, 0),
    await createTime_Slot(2, 5, 2),
    await createTime_Slot(2, 5, 0),

     //Alpha crew Saturday Night
    await createTime_Slot(0, 6, 0),
    await createTime_Slot(0, 6, 1),
    await createTime_Slot(0, 6, 2),

     //Bravo crew Sunday Morning
    await createTime_Slot(1, 7, 0),
    await createTime_Slot(1, 7, 0),
    await createTime_Slot(1, 7, 0),

    //Charlie crew Sunday Afternoon
    await createTime_Slot(2, 8, 0),
    await createTime_Slot(2, 8, 0),
    await createTime_Slot(2, 8, 0),

    //Alpha crew Sunday Night
    await createTime_Slot(0, 9, 0),
    await createTime_Slot(0, 9, 0),
    await createTime_Slot(0, 9, 1),

    //temp timeslot for adjusting shifts later
    //76
    await createTime_Slot(0, 25, 0)



    
  ]);
  console.log('TIME SLOTS SEEDED');
};
