import readline from 'readline'
import { stringify } from 'csv-stringify/sync'

import { from, BehaviorSubject } from 'rxjs'
import { buffer, tap, filter } from 'rxjs/operators'

const last = new BehaviorSubject
const current = new BehaviorSubject

const rl = readline.createInterface({
  input: process.stdin
})

from(rl)
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
