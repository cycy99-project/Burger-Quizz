#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: $0 <n>"
    exit 1
fi

n=$1

for i in $(seq 1 "$n"); do
    CFTUTIL send part=PARIS, idf=IDF"$i"
done
