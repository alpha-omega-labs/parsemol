```
npm i

# Download pdb_seqres file if not exists
wget -nc https://ftp.wwpdb.org/pub/pdb/derived_data/pdb_seqres.txt

cat pdb_seqres.txt | node tojson.js | sort | node jsontocsv.js | tee pdb_seqres.csv
```
