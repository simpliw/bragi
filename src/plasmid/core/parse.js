/**
 * Created by bqxu on 16/2/2.
 */
exports.parse = (text) => {
  let gbff = {};
  let lines = text.replace(/\r\n/g, '\n').split('\n');
  for (let lineno = 0; lineno < lines.length; lineno++) {
    let line = lines[lineno];
    let match;
    match = /^LOCUS\s+([^\n]+)/.exec(line);
    if (match) {
      match = match[1].split(/\s+/);
      gbff.name = match.shift();
      gbff.length = match.shift();
      gbff.modifed_at = match.pop();
    }
    else if (/^SOURCE/.test(line)) {
      gbff.source = {};
      line = lines[lineno + 1];
      while (/^\s/.test(line)) {
        lineno++;
        match = /^\s+(\w+)\s+([^\n]+)/.exec(line);
        if (match) gbff.source[match[1].toLowerCase()] = match[2].split(/;\s*/);
        line = lines[lineno + 1];
      }
    }
    else if (/^FEATURES/.test(line)) {
      gbff.features = [];
      line = lines[lineno + 1];
      while (/^\s/.test(line)) {
        lineno++;
        match = /^\s+(\S+)\s+(\S+)/.exec(line);
        let feature = {key: match[1], location: match[2], qualifier: {}};
        line = lines[lineno + 1];

        while (/^\s+\//.test(line)) {
          lineno++;
          var str = line.replace(/^\s+\//, '');
          match = /^([^=]+)=(\d+)$/.exec(str); // for integer values
          if (match === null) {
            // If multiple lines
            while (!/"$/.test(str)) {
              lineno++;
              if (lineno >= lines.length) return null;
              str += lines[lineno].replace(/^\s+/, '');
            }

            match = /^([^=]+)="(.+)"$/.exec(str); // for string values
            if (match === null) return null;
          }

          feature.qualifier[match[1]] = match[2].replace(/""/g, '');
          line = lines[lineno + 1];
        }
        gbff.features.push(feature);
        line = lines[lineno + 1];
      }
    }
    else if (/^ORIGIN/.test(line)) {
      gbff.origin = lines.slice(lineno + 1, -2).join('').replace(/[\s\d]/g, '');
      break;
    }
    else {
      match = /^(\w+)\s+([^\n]+)/.exec(line);
      if (match) {
        match[1] = match[1].toLowerCase();
        gbff[match[1]] = match[2];

        // If multiple lines
        line = lines[lineno + 1];
        while (/^\s/.test(line)) {
          lineno++;
          if (lineno >= lines.length) return null;
          gbff[match[1]] += ' ' + line.replace(/^\s+/, '');
          line = lines[lineno + 1];
        }

        gbff[match[1]] = gbff[match[1]].replace(/\s+/g, ' ');
      }
    }
  }
  return gbff;
};

