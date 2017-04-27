# Parameterized From Template

Parameterized Query From Template

Takes a template string and makes a parameterized query

By default the pg module has only rudimentary support for arrays of values in parameterized queries.
This module allows you to forget having to number your parameters within your query and instead use $s for single value and $a for an array of values

So, for example, instead of having to explicitly write
```
{
    text: 'select * from stuff where id in ($1,$2,$3) and degree=$4',
    values: [1,2,3,'high']
}
```
you can simply write:
```
parameterizedFromTemplate(
    'select * from stuff where id in ($a) and degree=$s',
    [[1,2,3],'high']
)
```
and it this function will translate that into the above

## parameterizedFromTemplate(queryTemplate,values)

Takes a template string and makes a parameterized query

Unlike parameterized query strings, template strings can handle arrays as values

## parameters
| name | description |
| --- | --- |
| queryTemplate | looks like parameterized query string except instead of $1,$2, etc. has $s for single value and $a for array of values |
| values | the array of values. Values can be single values or arrays of values |

## returns
the parameterized query object that you can pass into pg module's pool.query function