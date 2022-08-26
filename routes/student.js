const express = require('express');
const router = express.Router();
const fs = require('fs');

// get all students data
router.get('/', async (req, res) => {
    try {
        const data = await readFilePromise('data/student.json', 'utf8')
        const students = JSON.parse(data)
        res.status(200).json({students} )
    }catch (e) {
        console.log('error',e)
        res.status(500).send('server error')
    }
})

router.post('/', async (req, res) => {
    try {
        const { student } = req.body
        const data = await readFilePromise('data/student.json', 'utf8')
        let students = JSON.parse(data)
        let lastStudent = students[students.length - 1]
        let lastStudentId = lastStudent.ID
        let newStudentId = +lastStudentId + 1
        const newStudent = {}
        newStudent.ID = newStudentId
        newStudent.Name = student.Name
        newStudent.Gender = student.Gender
        newStudent.Class = student.Class
        newStudent.Seat = student.Seat
        newStudent.Strength = student.Strength
        students.push(newStudent)
        students = JSON.stringify(students)
        const writeFile = await writeFilePromise('data/student.json',students)
        if (writeFile === true) {
            res.status(200).json({message: 'student successfully added',students} )
        }else{
            res.status(200).json({message: 'failed to add student'} )
        }
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

// get student data By Id
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const data = await readFilePromise('data/student.json', 'utf8')
        const students = JSON.parse(data)
        const student = students.find(student => student.ID === id)
        res.status(200).json({student} )
    }catch (e) {
        res.status(500).json({ error: e.message })
    }
})

// get student data By Id and update
router.post('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const newStudent = req.body.student
        const data = await readFilePromise('data/student.json', 'utf8')
        let students = JSON.parse(data)
        const student = students.find(student => student.ID === id)
        if(!student) {
            return res.status(404).send('student not found')
        }
        student.Name = newStudent.Name
        student.Gender = newStudent.Gender
        student.Color = newStudent.Color
        student.Eyes = newStudent.Eyes
        const indexOfStudent = students.findIndex(student => student.ID === id)
        students.splice(indexOfStudent, 1, student);
        students = JSON.stringify(students)
        const writeFile = await writeFilePromise('data/student.json',students)
        if (writeFile === true) {
            res.status(200).json({message: 'student successfully updated',student} )
        }else{
            res.status(200).json({message: 'failed to update student'} )
        }
    }catch (e) {
        console.log('error',e)
        res.status(500).json({ error: e.message })
    }
})

router.delete('/:id', async (req, res) => {
        try {
            const id = req.params.id
            const data = await readFilePromise('./data/student.json', 'utf8')
            let students = JSON.parse(data)
            const student = await students.find(student => student.id === id)
            if (!student) {
                return res.status(404).send('student not found')
            }
            const indexOfStudent = students.findIndex(student => student.ID === id)
            students.splice(indexOfStudent, 1)
            students = JSON.stringify(students)
            const writeFile = await writeFilePromise('./data/student.json',students)
            if (writeFile === true) {
                res.status(200).json({message: 'student data successfully deleted',student} )
            }else{
                res.status(200).json({message: 'failed to delete student data'} )
            }
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
)

// converting callback function to a promises
const readFilePromise = (fileName,encoding) => {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, encoding, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
}

// converting callback function to a promises
const writeFilePromise = (fileName,content) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, content, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        })
    })
}

module.exports = router
