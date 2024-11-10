#! /usr/bin/env node

const { Command } = require('commander')
const fs = require('fs/promises')
const program = new Command()


program
  .command('add')
  .description('add expense in file')
  .argument('<category>', 'expense category')
  .argument('<price>', 'expense price')
  .action(async (category,price)=>{
    try{
      if(price < 10){
        console.log('minimal price should be 10')
        return
      }
      const data = await fs.readFile('expenses.json', 'utf-8')
      const parsedData = await JSON.parse(data)

      const lastId = parsedData[parsedData.length -1] ? parsedData[parsedData.length -1].id : 0
      const newExpens = {
        id: lastId + 1,
        category,
        price,
        date: new Date()
      }
      parsedData.push(newExpens)
      await fs.writeFile('expenses.json', JSON.stringify(parsedData))
      console.log('expense added')
    }catch(e){
      console.log(e,'error')
    }
  })
  
program
  .command('delete')
  .description('deletes expense by id')
  .argument('<id>')
  .action(async (id)=>{
    try{
      const data = await fs.readFile('expenses.json', 'utf-8')
      const parsedData = await JSON.parse(data)

      const indexToDelete = parsedData.findIndex(el => el.id === Number(id));
      if (indexToDelete !== -1) {
        parsedData.splice(indexToDelete, 1);
        await fs.writeFile('expenses.json', JSON.stringify(parsedData))
        console.log('expense deleted')
        return
      }
      console.log('expense not found')

    }catch(e){
      console.log(e,'error')
    }
  })


program
  .command('update')
  .description('update expense by id')
  .argument('<id>', 'expense id')
  .argument('<category>', 'expense category')
  .argument('<price>', 'expense price')
  .action(async (id,category,price)=>{
    try{
      const data = await fs.readFile('expenses.json', 'utf-8')
      const parsedData = await JSON.parse(data)

      const indexToEdit = parsedData.findIndex(el => el.id === Number(id));

      if(indexToEdit !== -1){
        parsedData[indexToEdit] = {
          id: Number(id),
          category,
          price,
          date: new Date()
        }
        await fs.writeFile('expenses.json', JSON.stringify(parsedData))
        console.log('expense updated')
        return
      }
      console.log('expense not found')

    }catch(e){
      console.log(e,'error')
    }

  })


program
  .command('get')
  .description('get expense by ID')
  .argument('<id>')
  .action(async(id)=>{
    try{
      const data = await fs.readFile('expenses.json', 'utf-8')
      const parsedData = await JSON.parse(data)

      const expense = parsedData.find(el => el.id === Number(id))

      if(expense){
        console.log(expense)
        return
      }
      console.log('expense not found')

    }catch(e){
      console.log(e,'error')
    }
  })

program
  .command('show')
  .option('--asc', 'sort by ascending')
  .option('--desc', 'sort by descending')
  .action(async (option)=>{

    const data = await fs.readFile('expenses.json', 'utf-8')
    const parsedData = await JSON.parse(data)

    if(Object.keys(option).length === 0){
      console.log(parsedData)
      return
    }
    if(option.asc){
      console.log(parsedData.sort((a, b) => new Date(a.date) - new Date(b.date)))
      return
    }
    if(option.desc){
      console.log(parsedData.sort((a, b) => new Date(b.date) - new Date(a.date)))
      return
    }
  })



program
  .command('price')
  .option('--asc', 'sort by ascending price')
  .option('--desc', 'sort by descending price')
  .action(async(option)=>{
    const data = await fs.readFile('expenses.json', 'utf-8')
    const parsedData = await JSON.parse(data)

    if(option.asc){
      console.log(parsedData.sort((a, b) => a.price - b.price))
      return
    }
    if(option.desc){
      console.log(parsedData.sort((a, b) => b.price - a.price))
      return
    }


  })

program.parse()