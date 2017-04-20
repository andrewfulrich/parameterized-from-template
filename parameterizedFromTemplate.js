/**
 Parameterized Query From Template

 take a template string and make a parameterized query

 Author: Andrew Ulrich

 MIT License

 Copyright (c) 2017 Andrew F. Ulrich

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

/**
 * take a template string and make a parameterized query
 * unlike parameterized query string, template string can handle arrays as values
 * @param queryTemplate looks like parameterized query string except instead of $1,$2, etc. has $s for single value and $a for array of values
 * @param values the array of values. Values can be single values or arrays of values
 */
function parameterizedFromTemplate(queryTemplate,values) {
  let paramMarkers=queryTemplate.match(/(\$a|\$s)/g)
  validateValues(queryTemplate,values,paramMarkers)

  return paramMarkers.reduce((accum,curr,index)=>{
    let val=values[index]
    if(curr=='$s') {
      accum.values.push(val)
      accum.text=accum.text.replace(/\$s/,'$'+accum.values.length)
    } else { //curr=='$a'
      let params=val.map((valElement,valIndex)=>{
        return '$'+(accum.values.length+1+valIndex)
      })
      accum.values=accum.values.concat(val)
      accum.text=accum.text.replace(/\$a/,params.join(','))
    }
    return accum
  },{
    values:[],
    text:queryTemplate
  })
}

function validateValues(queryTemplate,values,paramMarkers) {
  if(paramMarkers.length != values.length) {
    throw new Error('number of values expected by query template do not match values given.'
      +' Template string is '+queryTemplate
      +' values given are '+JSON.stringify(values))
  }
  values.forEach((value,index)=>{
    if(Array.isArray(value) && paramMarkers[index]=='$s') {
      throw new Error('single value expected by query template where an array was given.'
        +' Template string is '+queryTemplate
        +' value given is '+JSON.stringify(value))
    } else if (paramMarkers[index]=='$a' && !Array.isArray(value)) {
      throw new Error('array of values expected by query template where a single value was given.'
        +' Template string is '+queryTemplate
        +' value given is '+JSON.stringify(value))
    }
  })
}

module.exports=parameterizedFromTemplate