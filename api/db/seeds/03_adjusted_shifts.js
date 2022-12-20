/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const timeSlot = 76;

exports.seed = async function(knex) {
  let memberList = await knex.select('id', 'crew_position_id').from('users').where('role', 'member');
  
  const generateReplacement = async () => {

    let tempReplacement = {
      time_slot_id:timeSlot,
      removed_member_id:1,
      added_member_id:1
    }

    let removedIndex = await Math.floor(Math.random() * memberList.length);
    
    let addedIndex = await Math.floor(Math.random() * memberList.length);

    tempReplacement.removed_member_id = memberList[removedIndex].id;

    tempReplacement.added_member_id = memberList[addedIndex].id;

    return tempReplacement;


    


  }


  // Deletes ALL existing entries
  await knex('adjusted_assignments').del()
  await knex('adjusted_assignments').insert([
    // {time_slot_id:76, removed_member_id: 8, added_member_id:9}

    await generateReplacement(),
    await generateReplacement(),
    await generateReplacement(),
    await generateReplacement(),
    await generateReplacement(),
    await generateReplacement(),
    await generateReplacement(),
    await generateReplacement(),
    await generateReplacement(),
    await generateReplacement(),
    await generateReplacement(),
    await generateReplacement(),
    await generateReplacement(),
    await generateReplacement(),
    await generateReplacement(),
    await generateReplacement(),
    await generateReplacement(),
    await generateReplacement(),
    await generateReplacement(),
    await generateReplacement()
    
  ]);
  console.log('REPLACEMENT POSITIONS SEEDED');
};
