const tape=require('tape')
const parameterizedFromTemplate=require('../parameterizedFromTemplate')

tape('should throw an error on mismatching values',t=>{
  t.plan(1)
  let template='test $s test $s test ($s,$s,$s)'
  let values=[1,2,'a','b']
  try {
    parameterizedFromTemplate(template,values)
    t.fail('should have thrown an error by now')
  } catch(e) {
    t.pass('error was thrown')
  }
})

tape('should throw an error on single value when array expected',t=>{
  t.plan(1)
  let template='test $s test $a test ($s,$s,$s)'
  let values=[1,2,'a','b','c']
  try {
    parameterizedFromTemplate(template,values)
    t.fail('should have thrown an error by now')
  } catch(e) {
    t.pass('error was thrown')
  }
})

tape('should throw an error on array when single value expected',t=>{
  t.plan(1)
  let template='test $s test $s test ($s,$s,$s)'
  let values=[1,2,['a'],'b','c']
  try {
    parameterizedFromTemplate(template,values)
    t.fail('should have thrown an error by now')
  } catch(e) {
    t.pass('error was thrown')
  }
})

tape('should make a parameterized query object from the template and values',t=>{
  t.plan(1)
  let template='test $s test $a test ($s,$s,$s)'
  let values=[1,[1,2,3],'a','b','c']
  let expectedObject={
    text:'test $1 test $2,$3,$4 test ($5,$6,$7)',
    values:[1,1,2,3,'a','b','c']
  }
  let actual = parameterizedFromTemplate(template,values)
  t.deepEqual(actual,expectedObject,'should match expected object')
})