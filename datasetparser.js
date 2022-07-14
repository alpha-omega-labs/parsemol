import readline from 'readline'
import { stringify } from 'csv-stringify/sync'

import { from, BehaviorSubject } from 'rxjs'
import { buffer, tap, map, filter } from 'rxjs/operators'

const [ last, current ] = [ new BehaviorSubject, new BehaviorSubject ]

from(readline.createInterface({
  input: process.stdin
}))
.pipe(...[
  map(line => {
    last.next(current.getValue())
    if (line.match(/^\++$/)) {
      current.next()
    } else {
      return line
    }
  }),
  filter(Boolean),
  buffer(current),
  filter(lines => lines.length),
])
.subscribe(lines => {

  let currentField = null
  let item = {
    ID: [],
    PRIMARY: [],
  }

  lines.forEach(line => {
    const field = line.match(/^\[(.*)\]$/)
    if (field) {
      currentField = field[1]
      item[currentField] = []
    } else {
      item[currentField].push(line)
    }
  })

  process.stdout.write(stringify([
    [item['ID'], item['PRIMARY'], lines,].map(lines => lines.join("\n"))
  ]))

})
