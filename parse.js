import readline from 'readline'
import { stringify } from 'csv-stringify/sync'

import { from, BehaviorSubject } from 'rxjs'
import { buffer, tap, filter } from 'rxjs/operators'

const [ last, current ] = [ new BehaviorSubject, new BehaviorSubject]

from(readline.createInterface({
  input: process.stdin
}))
.pipe(...[
  tap(line => {
    last.next(current.getValue())
    const [, id] = line.match(/^>(.*?)_/) || [null, null]
    id && id !== current.getValue() && current.next(id)
  }),
  buffer(current),
  filter(lines => lines.length),
])
.subscribe(lines => {
  process.stdout.write(stringify([[
    last.getValue(),
    lines.join("\n"),
  ]]))
})
