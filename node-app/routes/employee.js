var express = require('express');
var router = express.Router();
var dbConn = require('../server');



//display employee page
router.get('/', function(req, res, next){

    dbConn.query('SELECT * FROM employee ORDER BY id desc', function(err,rows){
        if(err){
            req.flash('error', err);
            
            res.render('employee', {data: ''});
        }else{
            res.render('employee', {data: rows});
        }
    });
});

//display add employee page
router.get('/add', function(req,res,next){
    
    res.render('/views/employee/add', {
        Fullname: '', Position: '', workingHours: '', Salary: ''
    })
})
//add a new employee
router.post('/add', function(req, res, next){
    let Fullname = req.body.Fullname;
    let Position = req.body.Position;
    let workingHours = req.body.workingHours;
    let Salary = req.body.Salary;
    let errors = false;

    if(Fullname.length === 0 || Position.length === 0 || workingHours.length === 0 || Salary.length === 0){
        errors = true;

    
    req.flash('error', "Please fill all the data..");
    
    res.render('/views/employee/add', {
        Fullname: Fullname, Position: Position, workingHours: workingHours, Salary: Salary
    })
}

    if(!errors){
        var form_data = {
            Fullname: Fullname, Position: Position, workingHours: workingHours, Salary: Salary
        }

        
        dbConn.query('INSERT INTO employee Set ?', form_data, function(err, result){
            
            if(err){
                req.flash('error', err)
                res.render('/views/employee/add', {
                    Fullname: form_data.Fullname, Position: form_data.Position, workingHours: form_data.workingHours, Salary: form_data.Salary
                })
            }else {
                req.flash('Success', 'employee succesfully added');
                req.redirect('/views/employee');
            }
        })
    }
})

//display edit employee page
router.get('/edit/(:id)', function(req, res, next){
    let id = req.params.id;

    dbConn.query('SELECT * FROM employee WHERE id = ' + id, function(err,rows, fields){
        if(err) throw err

        if(rows.length <= 0){
            req.flash('error', 'employee not found with id = ' + id)
            res.redirect('/views/employee')
        }
        
        else {
            res.render('/views/employee/edit', {
                title: 'Edit employee', id: rows[0].id, Fullname: rows[0].Fullname, Position: rows[0].Position, workingHours: rows[0].workingHours, Salary: rows[0].Salary
            })
        }
    })
})

//update employee data
router.post('/update/(:id)', function(req, res, next){
    let id = req.params.id;
    let Fullname = req.body.Fullname;
    let Position = req.body.Position;
    let workingHours = req.body.workingHours;
    let Salary = req.body.Salary;
    let errors = false;

    if(Fullname.length === 0 || Position.length === 0 || workingHours.length === 0 || Salary.length === 0){
        errors = true;
        
        req.flash('error', "Please fill all the data...");
        
        res.render('/views/employee/edit', {
            id: req.params.id, Fullname: Fullname, Position: Position, workingHours: workingHours, Salary: Salary
        })
    }
    
    if(!errors) {
        var form_data = {
            Fullname: Fullname, Position: Position, workingHours: workingHours, Salary: Salary
        }
        
        dbConn.query('UPDATE employee SET ? WHERE id = ' + id, form_data, function(err, result){
            if(err){
                
                req.flash('error', err)
                
                res.render('/views/employee/edit', {
                    id: req.params, Fullname: form_data.Fullname, Position: form_data.Position, workingHours: form_data.workingHours, Salary: form_data.Salary
                })
            }
            else{
                req.flash('Success', 'employee successfully updated');
                req.redirect('/views/employee');
            }
        })
    }
})

// delet employee
router.get('/delete/(:id)', function(req, res, next){
    let id = req.params.id;

    dbConn.query('DELETE FROM employee WHERE id = ' + id, function(err, result){
        
        if(err){
            req.flash('error', err)
            
            res.redirect('employee')
        }else{
            req.flash('success', 'employee successfully deleted! ID = ' + id)
            
            res.redirect('employee')
        }
    })
})

module.exports = router;