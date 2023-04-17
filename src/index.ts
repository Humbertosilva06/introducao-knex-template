import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './database/knex'
import { error } from 'console'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong! knex" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

// PRATICA 1
//endpoint pra testar o knex
//OBS: geralmente, pra criação de tabelas continuamos usando o SQL, o query builder usaremos pra popular editar e etc. O metodo raw que vai rodar as querys pra gente, tudo que ta dentro dele são comandos SQL, entao não precisamos ir no sql dar execute, o código fará isso pra mim

app.get("/bands", async (req: Request, res: Response) => {
    try {
        //o  result espera oa conxeão com o db e retorna a qeury
        // O select dentro de uma template string
        const result = await db.raw(`
            SELECT * FROM bands;           
        `)

        res.status(200).send(result)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


//PRATICA 2

app.post("/bands", async (req: Request, res: Response) => {
    try {

        const id = req.body.id as string
        //OBS: poderia gerar o id assim (È uma alteranativa temporaria)
        // const id = Date.now()
        const name = req.body.name as string

        //verificações

        if (!id || !name) {
            res.status(400)
            throw new Error("dados invalidos, inserir valores validos")
        }

        if (name.length < 3) {
            res.status(400)
            throw new Error("Nome muito curto, use ao menos 3 caracteres")
        }

        //query
        //OBS: Note que onde eu coloco a template string do id e name, elas estão entre parenteses, pq são no tipo TEXT no sql: ("b001", "nome qualquer"; ("${}", "${}"))
        await db.raw(`
            INSERT INTO bands (id, name)
            VALUES
            ("${id}", "${name}");        
        `)

        res.status(200).send({ message: "banda criada" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

// PRATICA 3

app.put("/bands/:id", async (req: Request, res: Response) => {
    try {

        const id = req.params.id as string      
        const name = req.body.name as string

        //verificações
        if(!id){
            res.status(400)
            throw new Error ("id invalido, insira ID")
        }
        if (!name) {
            res.status(400)
            throw new Error("nome invalido, insera um nome ")
        }

        if (name.length < 3) {
            res.status(400)
            throw new Error("Nome muito curto, use ao menos 3 caracteres")
        }

        //query
        //OBS: Note que onde eu coloco a template string do id e name, elas estão entre parenteses, pq são no tipo TEXT no sql: ("b001", "nome qualquer"; ("${}", "${}"))

        //vamos receber a id por params e pode seer que eu passe a id 500 e minha lista só tenha 4 itens, vamos selecionar na tabela e ver se o id bate
        //OBS: o where sempre retorna um ARRAY
        //ONS o band ta entre colchetes pq é uma descontrução de array, entao ele ja tras o elemento do indice. na hora de chamar como só espero vir uma banda, poderia colocar band[0]
        const [band] = await db.raw(`
        SELECT *FROM bands
        WHERE id = "${id}";      
        `)
        // selecionamos a banda na tabela pelo id passado por params, e fazemos uma verificação pra ver se achou algo
        if(!band){
            res.status(404)
            throw new Error("banda não encontrado")
        }

        await db.raw(`
            UPDATE bands
            SET name = "${name}"
            WHERE id = "${id}";
        `)

        

        res.status(200).send({ message: "banda alterada"})
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


// FIXAÇÃO 1

app.get("/songs", async (req: Request, res: Response) => {
    try {
        //o  result espera oa conxeão com o db e retorna a qeury
        // O select dentro de uma template string
        const result = await db.raw(`
            SELECT * FROM songs;           
        `)

        res.status(200).send(result)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

// FIXAÇÃO 2

app.post("/songs", async (req: Request, res: Response) => {
    try {

        const song_id = req.body.song_id as string    
        const name = req.body.name as string
        const band_id = req.body.band_id as string
        //verificações

        if (!song_id || !name || !band_id) {
            res.status(400)
            throw new Error("dados invalidos, inserir valores validos")
        }

        const [band] = await db.raw(`
        SELECT *FROM bands
        WHERE id = "${band_id}";      
        `)

        if (!band){
            res.status(404)
            throw new Error("banda não encontrada, verifique o numero de band_id novamente")
        }

        if(name.length < 3) {
            res.status(400)
            throw new Error("Nome muito curto, use ao menos 3 caracteres")
        }

        if (song_id.length < 3){
            res.status(400)
            throw new Error("Id precisa ter no minimo 4 caracteres")
        }

        //query
        //OBS: Note que onde eu coloco a template string do id e name, elas estão entre parenteses, pq são no tipo TEXT no sql: ("b001", "nome qualquer"; ("${}", "${}"))
        await db.raw(`
            INSERT INTO songs (id, name, band_id)
            VALUES
            ("${song_id}", "${name}", "${band_id}");        
        `)

        res.status(200).send({ message: "musica criada com sucesso" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//fixação 3


app.put("/songs/:id", async (req: Request, res: Response) => {
    try {

        const id = req.params.id as string      
        const name = req.body.name as string

        //verificações
        if(!id){
            res.status(400)
            throw new Error ("id invalido, insira ID")
        }
        if (!name) {
            res.status(400)
            throw new Error("nome invalido, insera um nome ")
        }

        if (name.length < 3) {
            res.status(400)
            throw new Error("Nome muito curto, use ao menos 3 caracteres")
        }

       
        const [song] = await db.raw(`
        SELECT *FROM songs
        WHERE id = "${id}";      
        `)
        
        if(!song){
            res.status(404)
            throw new Error("banda não encontrado")
        }

        await db.raw(`
            UPDATE songs
            SET name = "${name}"
            WHERE id = "${id}";
        `)

        

        res.status(200).send({ message: "musica alterada"})
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})








