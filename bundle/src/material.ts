// Just a dummy file:
//  The build/material.js flatflatModuleOutFile in our tsconfig.json has sourcemappings to
//  non-existent src/material.ts. This empty file prevents errors during the building
//  of sourcemaps for material.js. It's probably an angular ngc bug. Having an empty file
//  at the referenced location prevents having errors like:
//  {"errno":-4058,"code":"ENOENT","syscall":"open","path":"...\\material\\src\\material.ts"}
//  in our sourcemaps
