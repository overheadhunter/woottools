#!/bin/bash

licenseFile="./LICENSE"
wootScripts="./woot/woot/*"
concatenatedFile="./build/woot_concat.js"
compressedFile="./build/woot_compressed.js"
yuicompressor="./build/yuicompressor-2.4.8.jar"

# Check if yuicompressor exists
if [ ! -f $yuicompressor ]; then
	echo "The configured yui compressor in this script does not exist."
	exit 1
fi

# Cleanup
rm $concatenatedFile
rm $compressedFile

# Concat scripts
for script in $wootScripts; do
	cat $script >> $concatenatedFile
	echo "" >> $concatenatedFile
done

# Add license file to ouput
echo "/*" > $compressedFile
cat $licenseFile >> $compressedFile
echo "*/" >> $compressedFile

# Add compressed script to output
result=`java -jar $yuicompressor --charset UTF-8 --type js $concatenatedFile >> $compressedFile`

exit $result;