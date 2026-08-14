import { cp, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { defineConfig } from "vite";

function copyStudentPortalStaticAssets() {
  return {
    name: "copy-student-portal-static-assets",
    async closeBundle() {
      await mkdir(resolve("dist/apps/student-dashboard/src/assets"), { recursive: true });
      await cp(
        resolve("apps/student-dashboard/src/assets"),
        resolve("dist/apps/student-dashboard/src/assets"),
        { recursive: true }
      );
      await cp(resolve("student-portal-sw.js"), resolve("dist/student-portal-sw.js"));
    }
  };
}

export default defineConfig({
  base: "./",
  plugins: [copyStudentPortalStaticAssets()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        launcher: resolve("index.html"),
        studentLogin: resolve("apps/student-login/index.html"),
        studentDashboard: resolve("apps/student-dashboard/index.html")
      },
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/firebase") || id.includes("node_modules/@firebase")) {
            return "firebase";
          }

          if (id.includes("learningActivities") || id.includes("PracticeModePlayer")) {
            return "student-player";
          }
        }
      }
    }
  }
});
