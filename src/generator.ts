// TypeScript for Recompensas Br.ino generator

interface Prize {
  id: string;
  seg: string | string[];
  emo: string;
  name: string;
  desc: string;
  pts: number;
  qty?: string;
  img?: string;
  link?: string;
  file?: { name: string; data: string };
  custom?: boolean;
}

interface CatalogConfig {
  mode: string;
  fmt: string;
  showPts: boolean;
  title: string;
  teacher: string;
  klass: string;
  school: string;
  slug?: string;
  items: Prize[];
  skills: Record<string, string>;
  objetivo: string;
}

interface Order {
  id: string;
  studentName: string;
  prizeName: string;
  skillName: string | null;
  timestamp: string;
}

function escapeHtml(value: string | number | null | undefined): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const LOGO = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTk1IiBoZWlnaHQ9IjY5IiB2aWV3Qm94PSIwIDAgMTk1IDY5IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNOTcuOTc2OSAyNC42NjQ0Qzk5LjU1NTMgMjYuOTY5MSAxMDAuMzQzIDMwLjE5NDggMTAwLjM0MyAzNC4zMzkxQzEwMC4zNDMgMzYuODc1MiA5OS45NDk0IDM5LjEzNDEgOTkuMTU5IDQxLjExMzVDOTguMzcxIDQzLjA5MjkgOTcuMjM5MiA0NC42MzkzIDk1Ljc3MDcgNDUuNzU1Qzk0LjI5OTkgNDYuODY4NCA5Mi45NjExIDQ3LjQyNTEgOTAuNTQ5NiA0Ny40MjUxQzg5LjIxODYgNDcuNDI1MSA4OC4wMDQ0IDQ3LjE0NTYgODYuOTA3IDQ2LjU4ODlDODUuODA3MyA0Ni4wMzIyIDg0Ljg3MjYgNDUuMjU3OCA4NC4xMDA2IDQ0LjI2ODJMODMuODg1MiA0NS42MzgxQzgzLjc5NTkgNDYuMjEzMiA4My4zMDEgNDYuNjM0NyA4Mi43MTkxIDQ2LjYzNDdINzguNDEyMUM3Ny43NTkyIDQ2LjYzNDcgNzcuMjMyMyA0Ni4xMDU1IDc3LjIzMjMgNDUuNDU0OVYxMi4xNzY0Qzc3LjIzMjMgMTEuNTIzNSA3Ny43NjE0IDEwLjk5NjYgNzguNDE0NCAxMC45OTY2TDgzLjM4NTggMTEuMDAxMkM4NC4wMzY0IDExLjAwMTIgODQuNTY1NiAxMS41MzA0IDg0LjU2NTYgMTIuMTgxVjI0LjQ5OTVDODUuMzA3OSAyMy40Nzc3IDg2LjI1ODYgMjIuNjczNiA4Ny40MjAxIDIyLjA4NzFDODguNTc5MyAyMS41MDA2IDg5Ljg0MTcgMjEuMjA1MSA5MS4yMDI2IDIxLjIwNTFDOTQuMTQxOCAyMS4yMDUxIDk2LjQwMDcgMjIuMzU3NCA5Ny45NzY5IDI0LjY2MjFWMjQuNjY0NFpNOTIuNzMyOCAzNC4zMzkxQzkyLjczMjggMzEuMzk5OCA5Mi4zOTE1IDI5LjM3NDYgOTEuNzExMSAyOC4yNTg5QzkxLjAzMDcgMjcuMTQ1NSA5MC4wNDEgMjYuNTg4OEM4Ny4xMDE3IDI2LjU4ODggODUuNzA4OCAyNy41NDg3IDg0LjU2NTYgMjkuNDY2M1YzOS43MjI5Qzg1LjAzMDcgNDAuNDY1MiA4NS41OTQzIDQxLjA0NDggODYuMjU4NiA0MS40NjRDODYuOTIzIDQxLjg4MSA4Ny42NDI0IDQyLjA4OTQgODguMTY3IDQyLjA4OTRDOTEuMjk0MiA0Mi4wODk0IDkyLjczMjggMzkuNTA3NSA5Mi43MzI4IDM0LjMzOTFWiiBmaWxsPSIjMzhCNTRGIi8+CjxwYXRoIGQ9Ik0xMjAuNTc5IDIyLjc0TDExOS43OTggMjcuNTE2N0MxMTkuNjk1IDI4LjE1MzUgMTE5LjA5NyAyOC41OTggMTE4LjQ1OCAyOC40OTcyQzExOC4wNDEgMguNDMwNyAxMTcuNjc5IDI4LjM5ODcgMTE3LjM3MiAyOC4zOTg3QzExNS45MTcgMjguMzk4NyAxMTQuODEzIDI4LjkwMjcgMTE0LjA1NSAyOS45MDYxQzExMy4yOTcgMzAuOTExOCAxMTIuNzAxIDMyLjQxOTMgMTEyLjI2OCAzNC40MzA3VjQ1LjQ1NDhDMTEyLjI2OCA0Ni4xMDc4IDExMS43MzkgNDYuNjM0NyAxMTEuMDg4IDY2LjYzNDdIMTA2LjExN0MxMDUuNDY0IDQ2LjYzNDcgMTA0LjkzNyA0Ni4xMDU1IDEwNC45MzcgNDUuNDU0OFYyMy4xNzUzQzEwNC45MzcgMjIuNTIyMyAxMDUuNDY2IDIxLjk5NTQgMTA2LjExNyAyMS45OTU0SDExMC4zQzExMC44OTYgMjEuOTk1NCAxMTEuMzk3IDIyLjQzNzYgMTExLjQ3MSAyMy4wMjg2TDExMS45NDMgMjYuNzc2N0MxMTIuNDk5IDI1LjA3NjggMTEzLjM0MiAyMy43MzY2IDExNC40NzIgMjIuNzYyOUMxMTUuNjAxIDIxLjc4OTIgMTE2Ljg3NyAyMS4zMDEzIDExOC4zIDIxLjMwMTNDMTE4Ljc0MiAyMS4zMDEzIDExOS4xNjQgMjEuMzI2NSAxMTkuNTY5IDIxLjM3OTJDMTIwLjIzNCAyMS40NjYyIDEyMC42ODcgMjIuMDgwMiAxMjAuNTc3IDIyLjc0MjNMMTIwLjU3OSAyMi43NFoiIGZpbGw9IiMzOEI1NEYiLz4KPHBhdGggZD0iTTEyMS43MiA0Ny45MjQ2QzEyNC4zMTUgNDcuOTI0NiAxMjYuNDE5IDQ1LjgyMDkgMTI2LjE5IDQzLjIyNTlDMTI2LjQxOSA0MC42MzA4IDEyNC4zMTUgMzguNTI3MSAxMjEuNzIgMzguNTI3MUMxMTkuMTI1IDM4LjUzNzEgMTE3LjAyMSA0MC42MzA4IDExNy4wMjEgNDMuMjI1OUMxMTcuMDIxIDQ1LjgyMDkgMTE5LjEyNSA0Ny45MjQ2IDEyMS43MiA0Ny45MjQ2WiIgZmlsbD0iIzM4QjU0RiIvPgo8cGF0aCBkPSJNMTM4LjMwNSAyMS45OTU0SDEzMC45NzFWNDYuNjM2OUgxMzguMzA1VjIxLjk5NTRaIiBmaWxsPSIjMjMxRjIwIi8+CjxwYXRoIGQ9Ik0xNjYuMDk4IDIxLjk5NTRIMTU5LjY0OVYzMS4xODQ0TDE2MC43NjMgNDEuMjkyMUwxNTMuMjQ2IDIxLjk5NTRIMTQ0LjE5NVY0Ni42MzY5SDE1MC42NDZWMzcuOTk1NEwxNDkuNTMyIDI4LjM1MjhMMTU2Ljk0MSA0Ni42MzY5SDE2Ni4wOThWMjEuOTk1NFoiIGZpbGw9IiMyMzFGMjAiLz4KPHBhdGggZD0iTTE5MS41MjggMjQuNjY0NkMxOTMuNjYzIDI2Ljk2OTMgMTk0LjczMSAzMC4xOTQ5IDE5NC43MzEgMzQuMzM5M0MxOTQuNzMxIDM2Ljk2OTMgMTk0LjI0MyAzOS4yNjcxIDE5My4yNjkgNDEuMjMwNUMxOTIuMjk2IDQzLjE5NjEgMTkwLjkwMyA0NC43MTk2IDE4OS4wOTMgNDUuODAwOUMxODcuMjgzIDQ2Ljg4NDYgMTg1LjE0MSA0Ny40MjUyIDE4Mi42NjcgNDcuNDI1MkMxNzguOTIzIDQ3LjQyNTIgMTc1Ljk3NyA2Ni4yNzI5IDE3My44MjYgNDMuOTY4MkMxNzEuNjc1IDQxLjY2MzUgMTcwLjYgMzguNDM3OCAxNzAuNiAzNC4yOTM1QzE3MC42IDMxLjY2MzQgMTcxLjA4OCAyOS4zNjc5IDE3Mi4wNjIgMjcuNDAyM0MxNzMuMDM1IDI1LjQzODkgMTc0LjkyOCAyMy45MTU0IDE3Ni4yMzggMjIuODMxOEMxNzguMDQ4IDIxLjc0ODIgMTgwLjE5IDIxLjIwNzUgMTgyLjY2NyAyMS4yMDc1QzE4Ni40NCAyMS4yMDc1IDE4OS4zOTUgMjIuMzU5OSAxOTEuNTMgMjQuNjY0NkgxOTEuNTI4WiIgZmlsbD0iIzIzMUYyMCIvPgo8cGF0aCBkPSJNMTM4LjY0OCAxMC45OTY2SDEzMC42MjVWMTguMzI5OUgxMzguNjQ4VjEwLjk5NjZaIiBmaWxsPSIjMjMxRjIwIi8+CjxwYXRoIGQ9Ik0zOC43MDI5IDQ3LjAyMTlMMjUuNjgzNCA2NC45NjdLMy42NjcyNSAzNC4zMTYyTDI1LjY4MzQgMy42NjU1M0wzOC42OTM3IDIxLjYyNDNMMDkuOTQ4MSAxOC40ODhMMjguNjUyMSAxLjUxNDMyQzI3Ljk2MjkgMC41NjM1NzYgMjYuODU4NiAwIDI1LjY4MzQgMEgyNS42NzY1QzI0LjQ5OSAwLjAwMjI5MDk2IDIzLjM5MjQgMC41NzA0NDggMjIuNzA1MSAxLjUyODA3TDAuNjg5MDA1IDMyLjE3ODhDLTAuMjI5NjY4IDMzLjQ1NzEgLTAuMjI5NjY4IDM1LjE3NzYgMC42ODkwMDUgMzYuNDU2TDIyLjcwNTEgNjcuMTA2N0MyMy4zOTI0IDY4LjA2MiAyNC40OTY2IDY4LjYzMDIgMjUuNjc0MiA2OC42MzQ4SDI1LjY4MzRDMjYuODU4NiA2OC42MzQ4IDI3Ljk2MDYgNjguMDcxMiAyOC42NTAyIDY3LjEyMjdMNDAuOTU3MiA1MC4xNjA1TDM4LjcwMjkgNDcuMDI0MlY0Ny4wMjE5WiIgZmlsbD0iIzM4QjU0RiIvPgo8cGF0aCBkPSJMNDcuOTA4IDguNzk3MzZMMjkuNTczNCAzNC4zMTYzTDQ3LjkwOCA1OS44MzUzTDY2LjQxMjEgMzQuMDc4MUw0Ny45MDggOC43OTczNloiIGZpbGw9IiMyMzFGMjAiLz4KPHBhdGggZD0iTDBMS42MDU2IDYxLjI1MzNMMDkuMDUxMiA2My4zMjg5QzgwLjgyMjEgNjMuMjY0NyA4MC42NDExIDYzLjIzMjcgODAuNTA4MiA2My4yMzI3QzgwLjEzMDIgNjMuMjMyNyA3OS44MTY0IDYzLjQwNjggNzkuNTY2NyA2My43NTI3Qzc5LjMxNyA2NC4wOTg2IDc5LjA5MjQgNjQuNTk1OCA3OC44OTU0IDY1LjI0MThMNzguNDY0NyA2OC42MDI3SDc2LjU1NjNMNzcuNDY4MSA2MS4zNDk1SDc5LjEzMTRMNzkuMTA2MSA2Mi43MDEyQzc5LjMyODQgNjIuMTk5NCA3OS42MDEgNjEuODE2OCA3OS45MjYzIDYxLjU0NjVDODAuMjUxNiA2MS4yNzg1IDgwLjU5MyA2MS4xNDMzIDgwLjk1NSA2MS4xNDMzQzgxLjE2ODEgNjEuMTQzMyA4MS4zODU3IDYxLjE4IDgxLjYwOCA2MS4yNTMzSDgxLjYwNTZaIiBmaWxsPSIjMjMxRjIwIi8+CjxwYXRoIGQ9Ik04MS43ODQ0IDY4LjAxNEM4MS4zMDMzIDY3LjQ2ODggODEuMDYyNiA2Ni43MTI4IDgxLjA2MjYgNjUuNzQ2QzgxLjA2MjYgNjQuOTk5MSA4MS4xODE4IDY0LjI3MjkgODEuNDIgNjMuNTY3M0M4MS42NTgzIDYyLjg2MTcgODIuMDUgNjIuMjc3NSA4Mi41OTUzIDYxLjgxMjRDODMuMTQwNSA2MS4zNDczIDgzLjg0NjIgNjEuMTE2IDg0LjcwNzYgNjEuMTE2Qzg1LjU2OSA2MS4xMTYgODYuMjMxIDYxLjM4ODYgODYuNzE0NCA2MS45MzYxQzg3LjE5NzggNjIuNDgxNCA4Ny40NDA3IDYzLjIyMzYgODcuNDQwNyA2NC4xNjI5Qzg3LjQ0MDcgNjQuOTA5OCA4Ny4zMjE2IDY1LjYzODMgODcuMDgzMyA2Ni4zNDg1Qzg2Ljg0NTEgNjcuMDU4NyA4Ni40NTMzIDY3LjY0OTggODUuOTA4MSA2OC4xMjRDODUuMzYyOCA2OC41OTgyIDg0LjY1NzIgNjguODM0MiA4My45OTU4IDY4LjgzNDJDODIuOTM0NCA2OC44MzQyIDgyLjI2MzEgNjguNTYxNiA4MS43ODIgNjguMDE0SDgxLjc4NDRaTTg1LjEyOTEgNjYuMjQ1NEM4NS4zNTgyIDY1LjU3NjUgODUuNDc3MyA2NC44NTAyIDg1LjQ4NjUgNjQuMDY2N0M4NS40ODY1IDYzLjU5MjUgODUuNDEwOSA2My4yNDY2IDg1LjI1OTcgNjMuMDI4OUM4NS4xMDg1IDYyLjgxMTMgODQuODc5NCA2Mi43MDEzIDg0LjU3NyA2Mi43MDEzQzg0LjAxMTIgNjIuNzAxMyA4My42MTAyIDYzLjAzODEgODMuMzc2NSA2My43MTE2QzgzLjE0MjggNjQuMzg1MiA4My4wMjYgNjUuMTA5MSA4My4wMjYgNjUuODgzNEM4My4wMjYgNjYuMzU3NyA4My4wOTkzIDY2LjcwMzYgODMuMjQ4MiA2Ni45MjEzQzgzLjM5NzEgNjcuMTM4OSA4My42MjYzIDY3LjI0ODkgODMuOTM3OCA2Ny4yNDg5Qzg0LjUwMzcgNjcuMjQ4OSA4NC45MDIzIDY2LjkxNDQgODUuMTMxNCA2Ni4yNDU0SDg1LjEyOTFaIiBmaWxsPSIjMjMxRjIwIi8+CjxwYXRoIGQ9Ik05NC4xMDc0IDYxLjg1MzZDOTQuNDUzMyA2Mi4zNDYyIDk0LjYyNTIgNjMuMDQyNiA5NC42MjUyIDYzLjk0M0M5NC42MjUyIDY0LjczNTYgOTQuNTA4MyA2NS41MDA4IDk0LjI3NDYgNjYuMjM4NUM5NC4wNDA5IDY2Ljk3NjIgOTMuNjQwMSA2Ny41OTI1IDkzLjA3NDIgNjguMDg5NkM5Mi41MDgzIDY4LjU4NjcgOTEuNzUyMyA2OC44MzQxIDkwLjgwODQgNjguODM0MUM5MC4zNDc5IDY4LjgzNDEgODkuOTAxMiA2OC43ODM3IDg5LjQ2NTkgNjguNjgyOUM4OS4wMzA3IDY4LjU4MjEgODguNTg0IDY4LjQzMzIgODguMTIzNSA2OC4yMzE2TDg5LjM1NiA1OC40NjUzTDkxLjI4OTUgNTguMjMzOUw5MC44MjIyIDYxLjk2MzZDOTEuMDY5NiA2MS43MDAxIDkxLjM0NjggNjEuNDkxNiA5MS42NjA3IDYxLjM0MjdDOTEuOTcyMyA2MS4xOTE1IDkyLjI5MyA2MS4xMTgyIDkyLjYyMDYgNjEuMTE4MkM5My4yNjg5IDYxLjExODIgOTMuNzY2IDYxLjM2MzMgOTQuMTEyIDYxLjg1NTlLOTQuMTA3NCA2MS44NTM2Wk05MC42MjI4IDYzLjUzNTJMOTAuMTc4NCA2Ny4wODYxQzkwLjQ1NzkgNjcuMjA1MyA5MC43MzI4IDY3LjI2NDggOTEuMDAzMiA2Ny4yNjQ4QzkxLjM4MTIgNjcuMjY0OCA5MS42OTUgNjcuMDk1MyA5MS45NDQ3IDY2Ljc1ODVDOTIuMTk0NCA2Ni40MjE4IDkyLjM3NTQgNjYuMDAwMiA5Mi40ODc3IDY1LjQ5NjJDOTIuNiA2NC45OTIyIDkyLjY1NDkgNjQuNDg4MiA5Mi42NTQ5IDYzLjk4NjVDOTIuNjU0OSA2My41MTIzIDkyLjU4NjIgNjMuMTgwMSA5Mi40NDY0IDYzLjE5ODlDOTIuMzA2NyA2Mi43OTk4IDkyLjExODkgNjIuNzAzNSA5MS44ODA2IDYyLjcwMzVDOTEuNDM2MiA2Mi43MDM1IDkxLjAxOTIgNjIuOTgwNyA5MC42MjUyIDYzLjUzNzVMODAuNjIyOCA2My41MzUyWiIgZmlsbD0iIzIzMUYyMCIvPgo8cGF0aCBkPSJNOTYuMDExMSA2OC4wMTRDOTUuNTMgNjcuNDY4OCA5NS4yODk1IDY2LjcxMjggOTUuMjg5NSA2NS43NDZDOTUuMjg5NSA2NC45OTkxIDk1LjQwODYgNjQuMjcyOSA5NS42NDY5IDYzLjU2NzNDOTUuODg1MiA2Mi44NjE3IDk2LjI3NjkgNjIuMjc3NSA5Ni44MjIxIDYxLjgxMjRDOTcuMzY3NCA2MS4zNDc0IDk4LjA3MyA2MS4xMTYgOTguOTM0NCA2MS4xMTZDOTkuNzk1OCA2MS4xMTYgMTAwLjQ1OCA2MS4zODg2IDEwMC45NDEgNjEuOTM2MUMxMDEuNDI1IDYyLjQ4MTQgMTAxLjY2NyA2My4yMjM2IDEwMS42NjcgNjQuMTYyOUMxMDEuNjY3IDY0LjkwOTggMTAxLjU0OCA2NS42MzgzIDEwMS4zMSA2Ni4zNDg1QzEwMS4wNzIgNjcuMDU4NyAxMDAuNjggNjcuNjQ5OCAxMDAuMTM1IDY4LjEyNEM5OS41ODk2IDY4LjU5ODIgOTguODg0IDY4LjgzNDIgOTguMDIyNiA2OC44MzQyQzk3LjE2MTIgNjguODM0MiA5Ni40OSA2OC41NjE2IDk2LjAwODkgNjguMDE0SDk2LjAxMTFaTTk5LjM1MzcgNjYuMjQ1NEM5OS41ODI4IDY1LjU3NjUgOTkuNzAxOSA2NC44NTAyIDk5LjcxMTEgNjQuMDY2N0M5OS43MTExIDYzLjU5MjUgOTkuNjM1NCA2My4yNDY2IDk5LjQ4NDIgNjMuMDI4OUM5OS4zMzMgNjIuODExMyA5OS4xMDQgNjIuNzAzOSA5OC44MDE1IDYyLjcwMTNDOTguMjM1NyA2Mi43MDEzIDk3LjgzNDcgNjMuMDM4MSA5Ny42MDEgNjMuNzExNkM3Ny4zNjc0IDY0LjM4NTIgOTcuMjUwNiA2NS4xMDkxIDk3LjI1MDYgNjUuODgzNEM5Ny4yNTA2IDY2LjM1NzcgOTcuMzIzOSA2Ni43MDM2IDk3LjQ3MjggNjYuOTIxM0M5Ny42MjE3IDY3LjEzODkgOTcuODUwOCA2Ny4yNDg5IDk4LjE2MjQgNjcuMjQ4OUM5OC43MjgyIDY3LjI0ODkgOTkuMTI2OCA2Ni45MTQ0IDk5LjM1NTkgNjYuMjQ1NEg5OS4zNTM3Wk0xMDAuMzI3IDU3LjE5NjFMMTAwLjkxOCA1OC44MDY3TDk3LjkwMTIgNjAuMTAzNEw5Ny40NzA1IDU4Ljk5NjhMMTAwLjMyNyA1Ny4xOTM4VjU3LjE5NjFaIiBmaWxsPSIjMjMxRjIwIi8+CjxwYXRoIGQ9Ik0xMDQuNjg3IDY2LjE5NzNDMTA0LjY3MSA2Ni4zNjIyIDEwNC42NjIgNjYuNDY5OSAxMDQuNjYyIDY2LjUyNDlDMTA0LjY2MiA2Ni43MzMzIDEwNC43MDEgNjYuODg2OCAxMDQuNzc5IDY2Ljk4MzFDMTA0Ljg1NyA2Ny4wNzkzIDEwNC45NzMgNjcuMTI3NCAxMDUuMTI5IDY3LjEyNzRDMTA1LjI0NCA2Ny4xMjc0IDEwNS4zNTYgNjcuMTA5MSAxMDUuNDY4IDY3LjA3MjRDMTA1LjU3OCA2Ny4wMzU4IDEwNS43MTMgNjYuOTc2MiAxMDUuODY5IDY2Ljg5MzdMMTA2LjM3MyA2OC4zMDA0QzEwNi4xMTAgNjguNDc0NSAxMDUuODE5IDY4LjYwNTEgMTA1LjQ5OCA2OC45NjdDMTA1LjE3NyA2OC43ODgzIDEwNC44NzUgNjguODM0MiAxMDQuNTg2IDY4LjgzNDJDMTAzLjk4NiA2OC44MzQyIDEwMy41MjggNjguNjU3OCAxMDMuMjA3IDY4LjMwMjdDMTAyLjg4NiA2Ny45NDc2IDEwMi43MjYgNjcuNDM2NyAxMDIuNzI2IDY2Ljc3MjNDMTAyLjcyNiA2Ni41OTEzIDEwMi43MzcgNjYuMzk4OSAxMDIuNzYzIDY2LjE5OTZMMTAzLjE5MyA2Mi44NTI1SDEwMi4yOTVMMTAyLjQ4MSA2MS4zNDk2SDEwMy40NjZMMTAzLjg3MSA1OS43MzkxTDEwNS41MjEgNTkuNTM1MkwxMDUuMjg3IDYxLjM1MTlIMTA2Ljc5TDEwNi4zODUgNjIuODU0OEgxMDUuMTA0TDEwNC42ODUgNjYuMjAxOEwxMDQuNjg3IDY2LjE5NzNaIiBmaWxsPSIjMjMxRjIwIi8+CjxwYXRoIGQ9Ik0xMDkuNzYxIDYxLjM0OTdMMTA4Ljg1MCA2OC42MDI4SDEwNi45NDFMMTA3Ljg1MyA2MS4zNDk3SDEwOS43NjFaTTEwOC4yNzIgNTkuNjc3M0MxMDguMDg0IDU5LjQ3MzQgMTA3Ljk4OCA1OS4yMDk5IDEwNy45ODggNTguODkxNUMxMDcuOTg4IDU4LjQ5OTcgMTA4LjExIDU4LjE3NjcgMTA4LjM1MyA1Ny45MjI0QzEwOC41OTUgNTcuNjY4MSAxMDguODk2IDU3LjUzOTggMTA5LjI1OCA1Ny41Mzk4QzEwOS41NjIgNTcuNTM5OCAxMDkuODA3IDU3LjY0MDYgMTA5Ljk5NyA1Ny44Mzk5QzExMC4xODUgNTguMDM5MiAxMTAuMjgyIDU4LjMwMDQgMTEwLjgyIDU4LjYxODhDMTEwLjI4MiA1OS4wMTA2IDExMC4xNiA1OS4zMzU5IDEwOS45MTcgNTkuNTk0OEMxMDkuNjc0IDU5Ljg1MzcgMTA5LjM3NCA1OS45ODQyIDEwOS4wMTIgNTkuOTg0MkMxMDguNzA4IDU5Ljk4NDIgMTA4LjQ2MiA1OS44ODEyIDEwOC4yNzIgNTkuNjc3M1oiIGZpbGw9IiMyMzFGMjAiLz4KPHBhdGggZD0iTTExNi4xNDIgNjIuMDQ2MkwxMTUuMTkzIDYzLjI3NjRDMTE0Ljg2NiA2Mi45Mzk3IDExNC40ODggNjIuNzcwMSAxMTQuMDU5IDYyLjc3MDFDMTEzLjQ1OSA2Mi43NzAxIDExMy4wMzMgNjMuMDc3MSAxMTIuNzc5IDYzLjY5MTFDMTEyLjUyNCA2NC4zMDUxIDExMi4zOTYgNjUuMDAzOCAxMTIuMzk2IDY1Ljc4NzNDMTEyLjM5NiA2Ni4yNzA3IDExMi40ODMgNjYuNjE0NCAxMTIuNjYyIDY2LjgxODNDMTEyLjgzOCA2Ny4wMjIxIDExMy4wOSA2Ny4xMjUyIDExMy40MiA2Ny4xMjUyQzExMy42NDIgNjcuMTI1MiAxMTMuODQ2IDY3LjA4NjMgMTE0LjAzNiA2Ny4wMDg0QzExNC4yMjQgNjYuOTMwNSAxMTQuNDUxIDY2LjgwMjIgMTE0LjcxNSA2Ni42MTg5TDExNS40MjkgNjcuOTk4MUMxMTQuNzQ3IDY4LjU1MjUgMTEzLjk5NSA2OC44MzIgMTEzLjE3NSA2OC44MzJDMTEyLjMwNCA2OC44MzIgMTExLjYyNCA2OC41NTI1IDExMS4xMzEgNjcuOTkxMkMxMTAuNjM5IDY3LjQzMjIgMTEwLjM5MSA2Ni42NjkzIDExMC4zOTEgNjUuNzAyNkMxMTAuMzkxIDY1LjAxMDcgMTEwLjUyIDY0LjMxMTkgMTEwLjc3NCA2My42MDYzQzExMS4wMjggNjIuOTAwNyAxMTEuNDMyIDYyLjMwOTcgMTExLjk4MSA2MS44MzA4QzExMi41MzEgNjEuMzUyIDExMy4yMjEgNjEuMTEzOCAxMTQuMDUgNjEuMTEzOEMxMTQuODggNjEuMTEzOCAxMTUuNjAxIDYxLjQyMyAxMTYuMTQ0IDYyLjA0MTZMMTE2LjE0MiA2Mi4wNDYyWiIgZmlsbD0iIzIzMUYyMCIvPgo8cGF0aCBkPSJNMTEyLjMzNyA2MS44ODEyTDEyMS43MzQgNjYuNTI1QzEyMS43MTggNjYuNjkgMTIxLjcwOSA2Ni43OTMxIDEyMS43MDkgNjYuODM4OUMxMjEuNzA5IDY2Ljk4NTUgMTIxLjczNCA2Ny4xIDEyMS43ODIgNjcuMTg3MUMxMjEuODMgNjcuMjc0MiAxMjEuOTIyIDY3LjM0NTIgMTIyLjA1MiA2Ny4zOTc5TDEyMS40OTggNjguNzkwOEMxMjEuMTIgNjguNzU0MSAxMjAuNzk3IDY4LjYzNzMgMTIwLjUyNCA2OC40NDI1QzEyMC4yNTQgNjguMjQ3OCAxMjAuMDczIDY3Ljk2MTQgMTE5Ljk4MiA2Ny41ODhDMTE5LjQ1NyA2OC40MTczIDExOC44MDYgNjguODMyIDExOC4wMzYgNjguODMyQzExNy4zNTQgNjguODMyIDExNi44MzEgNjguNTc1NCAxMTYuNDY3IDY4LjA2QzExNi4xMDEgNjcuNTQ2OCAxMTUuOTIgNjYuODQxMiAxMTUuOTIgNjUuOTVDMTE1LjkyIDY1LjE4NDggMTE2LjA0OCA2NC40MzM0IDExNi4zMDIgNjMuNjk1N0MxMTYuNTU3IDYyLjk1OCAxMTYuOTY0IDYyLjM0NCAxMTcuNTI4IDYxLjg1MTVDMTE4LjA4OSA2MS4zNTg5IDExOC44MDIgNjEuMTEzOCAxMTkuNjY1IDYxLjExMzhDMTIwLjYwOSA2MS4xMTM4IDEyMS41IDYxLjM2ODEgMTIyLjMzOSA2MS44Nzg5TDEyMi4zMzcgNjEuODgxMlpNMTE4LjYzNyA2My4xNTI3QzExOC4zNzggNjMuNDg5NSAxMTguMTkyIDYzLjkwODcgMTE4LjA3NSA2NC40MDgyQzExNy45NjEgNjQuOTA5OSAxMTcuOTA0IDY1LjQxODUgMTE3LjkwNCA2NS45Mzg1QzExNy45MDQgNjYuNDIxOSAxMTcuOTY4IDY2Ljc2MSAxMTguMDk0IDY2Ljk1NTdDMTE4LjIyMiA2Ny4xNTI3IDExOC40MDMgNjcuMjQ5IDExOC42NDEgNjcuMjQ5QzExOS4wNzcgNjcuMjQ5IDExOS40OTEgNjYuOTEyMiAxMTkuODg1IDY2LjIzODZMMTIwLjM0MSA2Mi43ODM5QzEyMC4xMDMgNjIuNjkyMiAxMTkuODYgNjIuNjQ2NCAxMTkuNjE1IDYyLjY0NjRDMTE5LjIyMSA2Mi42NDY0IDExOC44OTMgNjIuODE1OSAxMTguNjM3IDYzLjE1MjdaIiBmaWxsPSIjMjMxRjIwIi8+CjxwYXRoIGQ9Ik0xMzAuNzMxIDY1LjExODJDMTI5Ljk1NCA2NS41NDY2IDEyOC45NDEgNjUuODI4NCAxMjcuNjk1IDY1Ljk2NTlDMTI3LjczNiA2Ni44MjI3IDEyOC4xMjYgNjcuMjQ4OCAxMjguODY2IDY3LjI0ODhDMTI5LjEzNiA2Ny4yNDg4IDEyOS40MDYgNjcuMTkzOCAxMjkuNjcyIDY3LjA4MzlDMTI5LjkzOCA2Ni45NzM5IDEzMC4yMjQgNjYuODA2NyAxMzAuNTI5IDY2LjU3NzZMMTMxLjIxOSA2Ny44NjA1QzEzMC40MTQgNjguNTA2NSAxMjkuNTQ5IDY4LjgyOTYgMTI4LjYyMSA2OC44Mjk2QzEyNy42OTMgNjguODI5NiAxMjYuOTg3IDY4LjU1NDcgMTI2LjUwMiA2OC4wMDI1QzEyNi4wMTYgNjcuNDUyNyAxMjUuNzc1IDY2LjcwMzYgMTI1Ljc3NSA2NS43NTUxQzEyNS43NzUgNjUuMDI2NiAxMjUuOTAxIDY0LjMwNzIgMTI2LjE1MSA2My41OTdDMTI2LjQwMSA2Mi44ODY4IDEyNi44MDYgNjIuMjk1OCAxMjcuMzY1IDYxLjgyMTVDMTI3LjkyNCA2MS4zNDczIDEyOC42MyA2MS4xMTEzIDEyOS40ODQgNjEuMTExM0MxMzAuMjQ3IDYxLjExMTMgMTMwLjg0MSA2MS4yOTY5IDEzMS4yNjQgRef/GjEzMS42ODggNjIuMDQzNyAxMzEuODk5IDYyLjUxOCAxMzEuODk5IDYzLjA5MDdDMTMxLjg5OSA2NC4wMTE3IDEzMS41MTIgNjQuNjg1MiAxMzAuNzM1IDY1LjExMTNMMTMwLjczMSA2NS4xMTgyWk0xMjkuNDQzIDY0LjE2OThDMTI5Ljc4OSA2My45MDE3IDEyOS45NjEgNjMuNTc2NCAxMjkuOTYxIDYzLjE5MzhDMTI5Ljk2MSA2My4wMjIgMTI5LjkxMyA2Mi44NzA4IDEyOS44MTIgNjIuNzQyNUMxMjkuNzEzIDYyLjYxNDIgMTI5LjU1MyA2Mi41NTIzIDEyOS4zMzEgNjIuNTUzM0MxMjguOTA1IDYyLjU1MjMgMTI4LjU2MyA2Mi43NTE3IDEyOC4zMDkgNjMuMTUyNkMxMjguMDU1IDYzLjU1MzUgMTI3Ljc4IDY0LjA1MjkgMTI3Ljc4IDY0LjY1NTRDMTI4LjU0MyA2NC42MDA1IDEyOS4wOTcgNjQuNDQwMSAxMjkuNDQzIDY0LjE2OThaIiBmaWxsPSIjMjMxRjIwIi8+CjxwYXRoIGQ9Ik0xMzkuMTk4IDU4LjQ2NzdMMTM3LjkxNyA2OC42MDI5SDEzNi4yMTdMMTM2LjIzOSA2Ny41NjUxQzEzNiA2Ny45NDc3IDEzNS43MjMgNjguMjU0NyAxMzUuMzk3IDY4LjQ4NjFDMTM1LjA3MiA2OC43MTc1IDEzNC43MDEgNjguODM0MyAxMzQuMjgyIDY4LjgzNDNDMTMzLjYwOCA2OC44MzQzIDEzMy4wOTcgNjguNTc3NyAxMzIuNzQ5IDY4LjA2MjNDMTMyLjQwMSA2Ny41NDkxIDEzMi4yMjcgNjYuODI5NyAxMzIuMjI3IDY1LjUxMTFDMTMyLjIyNyA2NS4xOTE3IDEzMi4zMzkgNjQuNDYwOSAxMzIuNTY2IDYzLjcxODYxMzIuNzkyIDYyLjk3NjMgMTMzLjEzOCA2Mi4zNTc4IDEzMy42MDYgNjEuODYwNkMxMzQuMDczIDYxLjM2MzUgMTM0LjY1NyA2MS4xMTYxIDEzNS4zNTQgNjEuMTE2MUMxMzUuOTc3IDYxLjExNjEgMTM2LjQ3OSA2MS4zNDc1IDEzNi44NTcgNjEuODEyNUwxMzcuMzAxIDU4LjI0NzhMMTM5LjE5OCA1OC40NjU0VjU4LjQ2NzdaTTEzNC44NTcgIDYzLjIxNDZDMTM0LjYyMyA2My41NjUxIDEzNC40NTYgNjMuOTg4OSAxMzQuMzU3IDY0LjQ4MzhDMTM0LjI1OSA2NC45ODA5IDEzNC4yMDggNjUuNDU5NyAxMzQuMjA4IDY1LjkyNDhDMTM0LjIwOCA2Ni4zODk5IDEzNC4yNyA2Ni43NDk1IDEzNC4zOTQgNjYuOTQ4OUMxMzQuNTE4IDY3LjE0ODIgMTM0LjY5NCA2Ny4yNDkgMTM0LjkyMyA2Ny4yNDlDMTM1LjE3NyA2Ny4yNDkgMTM1LjQxOCA2Ny4xMjk4IDEzNS42NDUgNjYuODkzOUMxMzUuODcyIDY2LjY1NzkgMTM2LjEwMyA2Ni4zMzAzIDEzNi4zNDEgNjUuOTExMUwxMzYuNjg3IDYzLjIwNzdDMTM2LjU2MyA2My4wMzU5IDEzNi40MjggNjIuOTA1MyAxMzYuMjgyIDYyLjgxODNDMTM2LjEzMyA2Mi43MzEyIDEzNS45NjUgNjIuNjg3NyAxMzUuNzc4IDYyLjY4NzdDMTM1LjQgNjIuNjg3NyAxMzUuMDk1IDYyLjg2NDEgMTM0Ljg1OSA2My4yMTQ2SDEzNC44NTdaIiBmaWxsPSIjMjMxRjIwIi8+CjxwYXRoIGQ9Ik0xMzkuOTc1IDY4LjM1NTRDMTM5LjcwNCA2OC4wMzcgMTM5LjU2OSA2Ny41OTQ5IDEzOS41NjkgNjcuMDMxM0MxMDUuNTY5IDY2Ljg2NjMgMTM5LjU4MSA2Ni42OTkxIDEzOS42MDYgNjYuNTI1TDE0MC4yNzAgNjEuMzQ3NEgxNDIuMTc4TDE0MS41NzYgNjYuMTgxM0MxNDEuNTYgNjYuMzY0NiAxNDEuNTUxIDY2LjQ3NjkgMTQxLjU1MSA2Ni41MjI3QzQxLjU1MSA2Ni43NDAzIDE0MS41OSA2Ni44OTYxIDE0MS42NjggNjYuOTg3N0MxNDEuNzQ1IDY3LjA3OTQgMTQxLjg1OCA2Ny4xMjUyIDE0Mi4wMDcgNjcuMTI1MkMxNDIuMzkyIDY3LjEyNTIgMTQyLjgxMSA2Ni43NDI2IDE0My4yNjIgNjUuOTc3NEwxNDMuODQyIDYxLjM0NzRIMTQ1Ljc1TDE0NC44MzggNjguNjAwNkgxNDMuMTg5TDE0My4yMjYgNjcuNTIxNUMxNDIuNjE4IDY4LjM5NjcgMTQxLjg2OSA2OC44MzIgMTQxLjE1NyA2OC44MzJDMTQwLjYzOSA2OC44MzIgMTQwLjI0NSA2OC42NzE2IDEzOS45NzUgNjguMzUzMlY2OC4zNTU0WiIgZmlsbD0iIzIzMUYyMCIvPgo8cGF0aCBkPSJNMTUyLjEzIDYyLjA0NjJMMTUxLjE4MiA2My4yNzY0QzE1MC44NTQgNjIuOTM5NyAxNTAuNDc2IDYyLjc3MDEgMTUwLjA0OCA2Mi43NzAxQzE0OS40NDggNjIuNzcwMSAxNDkuMDIyIDYzLjA3NzEgMTguNzY3IDYzLjY5MTFDMTQ4LjUxMyA2NC4zMDUxIDE0OC4zODUgNjUuMDAzOCAxNDguMzg1IDY1Ljc4NzNDMTQ4LjM4NSA2Ni4yNzA3IDE0OC40NzIgNjYuNjE0NCAxNDguNjUxIDY2LjgxODNDMTQ4LjgyNyA2Ny4wMjIxIDE0OS4wNzkgNjcuMTI1MiAxNDkuNDA5IDY3LjEyNTJDMTQ5LjYzMSA2Ny4xMjUyIDE0OS44MzUgNjcuMDg2MyAxNTAuMDI1IDY3LjAwODRDMTUwLjIxMyA2Ni45MzA1IDE1MC40NCA2Ni44MDIyIDE1MC43MDMgNjYuNjE4OUwxNTEuNDE4IDY3Ljk5ODFDMTUwLjczNSA2OC41NTI1IDE0OS45ODQgNjguODMyIDE0OS4xNjQgNjguODMyQzE0OC4yOTMgNjguODMyIDE0Ny42MTMgNjguNTUyNSAxNDcuMTIgNjcuOTkxMkMxNDYuNjI4IDY3LjQzMjIgMTQ2LjM4IDY2LjY2OTMgMTQ2LjM4IDY1LjcwMjZDMTQ2LjM4IDY1LjAxMDcgMTQ2LjUwOSA2NC4zMTE5IDE0Ni43NjMgNjMuNjA2M0MxNDcuMDE3IDYyLjkwMDcgMTQ3LjQyIDYyLjMwOTcgMTQ3Ljk3IDYxLjgzMDhDMTQ4LjUyIDYxLjM1MiAxNDkuMjEgNjEuMTEzOCAxNTAuMDM5IDYxLjExMzhDMTUwLjg2OCA2MS4xMTM4IDE1MS41OSA2MS40MjMgMTUyLjEzMyA2Mi4wNDE2TDE1Mi4xMyA2Mi4wNDYyWiIgZmlsbD0iIzIzMUYyMCIvPgo8cGF0aCBkPSJNMTU4LjMyOCA2MS44ODEyTDE1Ny43MjUgNjYuNTI1QzE1Ny43MDkgNjYuNjkgMTU3LjcgNjYuNzkzMSAxNTcuNyA2Ni44Mzg5QzE1Ny43IDY2Ljk4NTUgMTU3LjcyNSA2Ny4xIDE1Ny43NzMgNjcuMTg3MUMxNTcuODIxIDY3LjI3NDIgMTU3LjkxMyA2Ny4zNDUyIDE1OC4wNDMgNjcuMzk3OUwxNTcuNDg5IDY4Ljc5MDhDMTU3LjExMSA2OC43NTQxIDE1Ni43ODggNjguNjM3MyAxNTYuNTE1IDY4LjQ0MjVDMTU2LjI0NSA2OC4yNDc4IDE1Ni4wNjQgNjcuOTYxNCAxNTUuOTcyIDY3LjU4OEMxNTUuNDQ4IDY4LjQxNzMgMTU0Ljc5NyA2OC44MzIgMTU0LjAyNyA2OC44MzJDMTUzLjM0NSA2OC44MzIgMTUyLjgyMiA2OC41NzU0IDE1Mi40NTggNjguMDZDMTUyLjA5MiA2Ny41NDY4IDE1MS45MTEgNjYuODQxMiAxNTEuOTExIDY1Ljk1QzE1MS45MTEgNjUuMTg0OCAxNTIuMDM5IDY0LjQzMzQgMTUyLjI5MyA2My42OTU3QzE1Mi41NDcgNjIuOTU4IDE1Mi45NTUgNjIuMzQ0IDE1My41MTkgNjEuODUxNUMxNTQuMDggNjEuMzU4OSAxNTQuNzkzIDYxLjExMzggMTU1LjY1NiA2MS4xMTM4QzE1Ni42IDYxLjExMzggMTU3LjQ5MSA2MS4zNjgxIDE1OC4zMyA2MS44Nzg5TDE1OC4zMjggNjEuODgxMlpNMTU0LjYyNSA2My4xNTI3QzE1NC4zNjYgNjMuNDg5NSAxNTQuMTgxIDYzLjkwODcgMTU0LjA2NCA2NC40MDgyQzE1My45NSA2NC45MDk5IDE1My44OTIgNDUuNDE4NSAxNTMuODkyIDY1LjkzODVDMTUzLjg5MiA2Ni40MjE5IDE1My45NTYgNjYuNzYxIDE1NC4wODIgNjYuOTU1N0MxNTQuMjExIDY3LjE1MjcgMTU0LjM5MiA2Ny4yNDkgMTU0LjYzIDY3LjI0OUMxNTUuMDY1IDY3LjI0OSAxNTUuNDggNjYuOTEyMiAxNTUuODc0IDY2LjIzODZMMTU2LjMzIDYyLjc4MzlDMTU2LjA5MiA2Mi42OTIyIDE1NS44NDkgNjIuNjQ2NCAxNTUuNjA0IDYyLjY0NjRDMTU1LjIxIDYyLjY0NjQgMTU0Ljg4MiA2Mi44MTU5IDE1NC42MjUgNjMuMTUyN1oiIGZpbGw9IiMyMzFGMjAiLz4KPHBhdGggZD0iTTE2NC43MTkgNjIuMDQ2MkwxNjMuNzcxIDYzLjI3NjRDMTYzLjQ0MyA2Mi45Mzk3IDE2My4wNjUgNjIuNzcwMSAxNjIuNjM3IDYyLjc3MDFDMTYyLjAzNyA2Mi43NzAxIDE2MS42MSA2My4wNzcxIDE2MS4zNTYgNjMuNjkxMUMxNjEuMTAyIDY0LjMwNTEgMTYwLjk3NCA2NS4wMDM4IDE2MC45NzQgNjUuNzg3M0MxNjAuOTc0IDY2LjI3MDcgMTYxLjA2MSA2Ni42MTQ0IDE2MS4yMzkgNjYuODE4M0MxNjEuNDE2IDY3LjAyMjEgMTYxLjY2OCA2Ny4xMjUyIDE2MS45OTggNjcuMTI1MkMxNjIuMiA2Ny4xMjUyIDE2Mi40MjQgNjcuMDg2MyAxNjIuNjE0IDY3LjAwODRDMTYyLjgwMiA2Ni45MzA1IDE2My4wMjkgNjYuODAyMiAxNjMuMjkyIDY2LjYxODlMMTY0LjAwNyA2Ny45OTgxQzE2My4zMjQgNjguNTUyNSAxNjIuNTczIDY4LjgzMiAxNjEuNzUyIDY4LjgzMkMxNjAuODgyIDY4LjgzMiAxNjAuMjAxIDY4LjU1MjUgMTU5LjcwOSA2Ny45OTEyQzE1OS4yMTYgNjcuNDMyMiAxNTguOTY5IDY2LjY2OTMgMTU4Ljk2OSA2NS43MDI2QzE1OC45NjkgNjUuMDEwNyAxNTkuMDk3IDY0LjMxMTkgMTU5LjM1MiA2My42MDYzQzE1OS42MDYgNjIuOTAwNyAxNjAuMDA5IDYyLjMwOTcgMTYwLjU1OSA2MS44MzA4QzE2MS4xMDkgNjEuMzUyIDE2MS43OTggNjEuMTEzOCAxNjIuNjI4IDYxLjExMzhDMTYzLjQ1NyA2MS4xMTM4IDE2NC4xNzkgNjEuNDIzIDE2NC43MjEgNjIuMDQxNkwxNjQuNzE5IDYyLjA0NjJaIiBmaWxsPSIjMjMxRjIwIi8+CjxwYXRoIGQ9Ik0xNjcuNTM5IDYxLjM0OTdMMTY2LjYyOCA2OC42MDI4SDE2NC43MTlMMTY1LjYzMSA2MS4zNDk3SDE2Ny41MzlaTTE2Ni4wNSA1OS42NzczQzE2NS44NjMgNTkuNDczNCAxNjUuNzY2IDU5LjIwOTkgMTY1LjY2IDU5LjIwOTlDMTY1Ljc2NiA1OC40OTk3IDE2NS44ODggNTguMTc2NyAxNjYuMTMxIDU3LjkyMjRDMTY2LjM3MyA1Ny42NjgxIDE2Ni42NzMgNTcuNTM5OCAxNjcuMDM1IDU3LjUzOThDMTY3LjM0IDU3LjUzOTggMTY3LjU4NSA1Ny42NDA2IDE2Ny43NzUgNTcuODM5OUMxNjcuOTYzIDU4LjAzOTIgMTY4LjA2IDU4LjMwMDQgMTY4LjA2IDU4LjYxODhDMTY4LjA2IDU5LjAxMDYgMTY3LjkzOCA1OS4zMzU5IDE2Ny42OTUgNTkuNTk0OEMxNjcuNDUyIDU5Ljg1MzcgMTY3LjE1MiA5OS45ODQyIDE2Ni43OSA1OS45ODQyQzE2Ni40ODYgNTkuOTg0MiAxNjYuMjQxIDU5Ljg4MTIgMTY2LjA1IDU5LjY3NzNaIiBmaWxsPSIjMjMxRjIwIi8+CjxwYXRoIGQ9Ik0xNjguOSA2OC4wMTRDMTY4LjQxOSA2Ny40Njg4IDE2OC4xNzkgNjYuNzEyOCAxNjguMTc5IDY1Ljc0NkMxNjguMTc5IDY0Ljk5OTEgMTY4LjI5OCA2NC4yNzI5IDE2OC41MzYgNjMuNTY3M0MxNjguNzc0IDYyLjg2MTcgMTY5LjE2NiA2Mi4yNzc1IDE2OS43MTEgNjEuODEyNEMxNzAuMjU3IDYxLjM0NzMgMTcwLjk2MiA2MS4xMTYgMTcxLjgyMyA2MS4xMTZDMTcyLjY4NSA2MS4xMTYgMTczLjM0NyA2MS4zODg2IDE3My44MyA2MS45MzYxQzE3NC4zMTQgNjIuNDgxNCAxNzQuNTU3IDYzLjIyMzYgMTc0LjU1NyA2NC4xNjI5QzE3NC41NTcgNjQuOTA5OCAxNzQuNDM3IDY1LjYzODMgMTc0LjE5OSA2Ni4zNDg1QzE3My45NjEgNjcuMDU4NyAxNzMuNTY5IDY3LjY0OTggMTczLjAyNCA2OC4xMjRDMTcyLjQ3OSA2OC41OTgyIDE3MS43NzMgNjguODM0MiAxNzAuOTEyIDY4LjgzNDJDMTcwLjA1IDY4LjgzNDIgMTY5LjM3OSA2OC41NjE2IDE2OC44OTggNjguMDE0SDE2OC45Wk0xNzIuMjQ1IDY2LjI0NTRDMTcyLjQ3NCA2NS41NzY1IDE3Mi41OTMgNjQuODUwMiAxNzIuNjAzIDY0LjA2NjdDMTcyLjYwMyA2My41OTI1IDE3Mi41MjcgNjMuMjQ2NiAxNzIuMzc2IDYzLjAyODlDMTcyLjIyNCA2Mi44MTEzIDE3MS45OTUgNjIuNzAxMyAxNzEuNjkzIDYyLjcwMTNDMTcxLjEyNyA2Mi43MDEzIDE3MC43MjYgNjMuMDM4MSAxNzAuNDkzIDYzLjcxMTZDMTcwLjI1OSA2NC4zODUyIDE3MC4xNDIgNjUuMTA5MSAxNzAuMTQyIDY1Ljg4MzRDMTcwLjE0MiA2Ni4zNTc3IDE3MC4yMTUgNjYuNzAzNiAxNzAuMzY0IDY2LjkyMTNDMTcwLjUxMyA2Ny4xMzg5IDE3MC43NDIgNjcuMjQ4OSAxNzEuMDU0IDY3LjI0ODlDMTcxLjYyIDY3LjI0ODkgMTcyLjAxOCA2Ni45MTQ0IDE3Mi4yNDcgNjYuMjQ1NEgxNzIuMjQ1WiIgZmlsbD0iIzIzMUYyMCIvPgo8cGF0aCBkPSJNMTgxLjA1MSA2MS41ODFDMTgxLjMxNSA2MS45MDMgMTgxLjQ0NSA2Mi4zMTg3IDE4MS40NDUgNjIuODYzOUMxODEuNDQ1IDYzLjAxMDUgMTgxLjQzNCA2My4xNzMyIDE4MS40MDkgNjMuMzU2NUwxODAuNzU2IDY4LjYwMDVIMTc4Ljg0OEwxNzkuNDUgNjMuODA1NUMxNzkuNDY2IDYzLjYyNDUgMTc5LjQ3NSA2My41MSAxNzkuNDc1IDYzLjQ2NDFDMTc5LjQ3NSA2My4yNDY1IDE3OS40NDEgNjMuMDkzIDE3OS4zNyA2My4wMDZDMTc5LjI5OSA2Mi45MTg5IDE3OS4yIDYyLjg3NTQgMTc5LjA2NyA2Mi44NzU0QzE3OC42MjMgNjIuODc1NCAxNzguMTQ0IDYzLjQ1MjcgMTc3LjYyNiA2NC42MDk2TDE3Ny4xMDkgNjguNTk4MkgxNzUuMkwxNzYuMTEyIDYxLjM0NUgxNzcuNzc1TDE3Ny43MzkgNjIuNjE0MkMxNzguMDI1IDYyLjE0OTEgMTc4LjM2MiA2MS43ODI2IDE3OC43NDkgNjEuNTE0NUMxNzkuMTM0IDYxLjI0NjUgMTc5LjU0MiA2MS4xMTEzIDE3OS45NjggNjEuMTExM0MxODAuNDI4IDYxLjExMTMgMTgwLjc4OCA2MS4yNjcxIDE4MS4wNTEgNjEuNTc2NFY2MS41ODFaIiBmaWxsPSIjMjMxRjIwIi8+CjxwYXRoIGQ9Ik0xODguNjM5IDYxLjg4MTJMMTg4LjAzNyA2Ni41MjVDMTg4LjAyIDY2LjY5IDE4OC4wMTEgNjYuNzkzMSAxODguMDExIDY2LjgzODlDMTg4LjAxMSA2Ni45ODU1IDE4OC4wMzcgNjcuMSAxODguMDg1IDY3LjE4NzFDMTg4LjEzMyA2Ny4yNzQyIDE4OC4yMjQgNjcuMzQ1MiAxODguMzU1IDY3LjM5NzlMMTg3LjgwMSA2OC43OTA4QzE4Ny40MjMgNjguNzU0MSAxODcuMSA2OC42MzczIDE4Ni44MjcgNjguNDQyNUMxODYuNTU3IDY4LjI0NzggMTg2LjM3NiA2Ny45NjE0IDE4Ni4yODQgNjcuNTg4QzE4NS43NTkgNjguNDE3MyAxODUuMTA5IDY4LjgzMiAxODQuMzM5IDY4LjgzMkMxODMuNjU2IDY4LjgzMiAxODMuMTM0IDY4LjU3NTQgMTgyLjc3IDY4LjA2QzE4Mi40MDMgNjcuNTQ2OCAxODIuMjIyIDY2Ljg0MTIgMTgyLjIyMiA2NS45NUMxODIuMjIyIDY1LjE4NDggMTgyLjM1IDY0LjQzMzQgMTgyLjYwNSA2My42OTU3QzE4Mi44NTkgNjIuOTU4IDE4My4yNjcgNjIuMzQ0IDE4My44MyA2MS44NTE1QzE4NC4zOTIgNjEuMzU4OSAxODUuMTA0IDY5LjExMzggMTg1Ljk2OCA2MS4xMTM4QzE4Ni45MTIgNjEuMTEzOCAxODcuODAzIDYxLjM2ODEgMTg4LjY0MSA2MS44Nzg5TDE4OC42MzkgNjEuODgxMlpNMTg0LjkzNyA2My4xNTI3QzE4NC42NzggNjMuNDg5NSAxODQuNDkyIDYzLjkwODcgMTQ0LjM3NiA2NC40MDgyQzE4NC4yNjEgNjQuOTA5OSAxODQuMjA0IDY1LjQxODUgMTg0LjIwNCA2NS45Mzg1QzE4NC4yMDQgNjYuNDIxOSAxODQuMjY4IDY2Ljc2MSAxODQuMzk0IDY2Ljk1NTdDMTg0LjUyMiA2Ny4xNTI3IDE4NC43MDMgNjcuMjQ5IDE4NC45NDEgNjcuMjQ5QzE4NS4zNzcgNjcuMjQ5IDE4NS43OTEgNjYuOTEyMiAxODYuMTg2IDY2LjIzODZMMTg2LjY0MSA2Mi43ODM5QzE4Ni40MDMgNjIuNjkyMiAxODYuMTYgNjIuNjQ2NCAxODUuOTE1IDYyLjY0NjRDMTg1LjUyMSA2Mi42NDY0IDE4NS4xOTQgNjIuODE1OSAxODQuOTM3IDYzLjE1MjdaIiBmaWxsPSIjMjMxRjIwIi8+CjxwYXRoIGQ9Ik0xOTEuMzI0IDY2LjY0ODZDMTkxLjMwOCA2Ni44MjI3IDE5MS4zMiA2Ni45NDQxIDE5MS4zNjEgNjcuMDE3NEMxOTEuNDAyIDY3LjA5MDcgMTkxLjQ3NSA2Ny4xMjc0IDE5MS41ODMgNjcuMTI3NEMxOTEuNjcyIDY3LjEyNzQgMTkxLjc4IDY3LjEwNDUgMTkxLjkwNCA2Ny4wNTg3TDE5Mi4xMzggNjguNTYxNUMxOTEuNzY5IDY4Ljc0MjUgMTkxLjM1NiA2OC44MzQxIDE5MC45MDUgNjguODM0MUMxOTAuNDE5IDY4LjgzNDEgMTkwLjA0NiA2OC42OTQ0IDE4OS43NzggNjguNDE3MkMxODkuNTEgNjguMTQgMTg5LjM3NyA2Ny43MzIyIDE4OS4zNzcgNjcuMTkzOEMxODkuMzc3IDY3LjAzOCAxODkuMzg4IDY2Ljg3NTQgMTg5LjQxNCA2Ni43MDEzTDE5MC40NiA1OC40NjUzTDE5Mi4zODMgNTguMjMzOUwxOTEuMzI0IDY2LjY0ODZaIiBmaWxsPSIjMjMxRjIwIi8+Cjwvc3ZnPg==";

// Set brand logo
const brandLogoEl = document.getElementById("brandLogo") as HTMLImageElement;
if (brandLogoEl) brandLogoEl.src = LOGO;

// Default prizes library
const LIB: Prize[] = [
  // EI
  { id: "ei1", seg: "EI", emo: "🧩", name: "Quebra-cabeça de encaixe", desc: "Peças grandes de encaixar, fáceis de manusear.", pts: 20 },
  { id: "ei2", seg: "EI", emo: "🐞", name: "Animais de montar", desc: "Bichinhos 3D que se montam por encaixe.", pts: 25 },
  { id: "ei3", seg: "EI", emo: "🏅", name: "Medalha de campeão", desc: "Medalha impressa em 3D com fita.", pts: 30 },
  { id: "ei4", seg: "EI", emo: "🚀", name: "Foguetinho de brinquedo", desc: "Mini-foguete colorido para brincar.", pts: 35 },
  { id: "ei5", seg: "EI", emo: "⭐", name: "Carimbo de estrelinha", desc: "Carimbo 3D para as atividades.", pts: 15 },
  { id: "ei6", seg: "EI", emo: "🦕", name: "Dinossauro articulado", desc: "Dino que mexe o rabo e a cabeça.", pts: 40 },
  // EFAI
  { id: "ai1", seg: "EFAI", emo: "🔑", name: "Chaveiro com o nome", desc: "Chaveiro 3D personalizado com o nome do aluno.", pts: 35 },
  { id: "ai2", seg: "EFAI", emo: "🔖", name: "Marcador de página", desc: "Marcador de livro com formato divertido.", pts: 20 },
  { id: "ai3", seg: "EFAI", emo: "🤖", name: "Mini-robô colecionável", desc: "Robozinho 3D para colecionar.", pts: 60 },
  { id: "ai4", seg: "EFAI", emo: "🌀", name: "Pião 3D", desc: "Pião impresso que gira de verdade.", pts: 30 },
  { id: "ai5", seg: "EFAI", emo: "✏️", name: "Ponteira de lápis", desc: "Enfeite 3D de encaixar no lápis.", pts: 25 },
  { id: "ai6", seg: "EFAI", emo: "🪀", name: "Ioiô impresso", desc: "Ioiô 3D montável e funcional.", pts: 45 },
  // EFAF
  { id: "af1", seg: "EFAF", emo: "📱", name: "Suporte de celular", desc: "Suporte de mesa geométrico para o celular.", pts: 55 },
  { id: "af2", seg: "EFAF", emo: "⚙️", name: "Fidget de engrenagens", desc: "Peça anti-estresse com engrenagens que giram.", pts: 50 },
  { id: "af3", seg: "EFAF", emo: "🎧", name: "Suporte de fones", desc: "Gancho/organizador para headset.", pts: 60 },
  { id: "af4", seg: "EFAF", emo: "💡", name: "Luminária geométrica", desc: "Abajur 3D low-poly (com LED).", pts: 90 },
  { id: "af5", seg: "EFAF", emo: "🔩", name: "Chaveiro geométrico", desc: "Chaveiro low-poly estiloso.", pts: 35 },
  { id: "af6", seg: "EFAF", emo: "🚁", name: "Chassi de mini-drone", desc: "Estrutura 3D para montar um drone.", pts: 110 },
  // HS
  { id: "hs1", seg: "HS", emo: "🖥️", name: "Organizador de mesa", desc: "Porta-objetos modular para a escrivaninha.", pts: 70 },
  { id: "hs2", seg: "HS", emo: "🎮", name: "Suporte de controle/headset", desc: "Base 3D para setup de estudos/games.", pts: 75 },
  { id: "hs3", seg: "HS", emo: "♟️", name: "Peças de xadrez", desc: "Conjunto de peças impressas em 3D.", pts: 120 },
  { id: "hs4", seg: "HS", emo: "🔧", name: "Protótipo mecânico", desc: "Peça funcional com engrenagens/mecanismo.", pts: 100 },
  { id: "hs5", seg: "HS", emo: "🗝️", name: "Chaveiro personalizado", desc: "Design próprio do aluno impresso em 3D.", pts: 40 },
  { id: "hs6", seg: "HS", emo: "🏗️", name: "Suporte de notebook", desc: "Elevador ergonômico para o notebook.", pts: 95 },
  // Coletivos (dupla / grupo / sala)
  { id: "col1", seg: ["EFAI", "EFAF"], qty: "dupla", emo: "🤝", name: "Projeto maker em dupla", desc: "A dupla ganha um mini-projeto para construir junta.", pts: 50 },
  { id: "col2", seg: ["EFAF", "HS"], qty: "grupo", emo: "🧩", name: "Desafio em grupo", desc: "Um kit de desafio maker para o grupo resolver.", pts: 80 },
  { id: "col3", seg: ["EI", "EFAI", "EFAF", "HS"], qty: "sala", emo: "🌳", name: "Aula ao ar livre", desc: "A turma toda ganha uma aula fora da sala.", pts: 150 },
  { id: "col4", seg: ["EI", "EFAI", "EFAF"], qty: "sala", emo: "🎲", name: "Dia de jogos na turma", desc: "Uma aula de jogos educativos escolhidos pela turma.", pts: 140 },
  { id: "col5", seg: ["EFAI", "EFAF", "HS"], qty: "sala", emo: "🍿", name: "Sessão de cinema maker", desc: "Um filme/vídeo com pipoca para a sala inteira.", pts: 160 }
];

// Constants mapping colors
const SEG: Record<string, { name: string; color: string }> = {
  EI: { name: "Educação Infantil", color: "#38B54F" },
  EFAI: { name: "Fundamental Anos Iniciais", color: "#F68B21" },
  EFAF: { name: "Fundamental Anos Finais", color: "#484588" },
  HS: { name: "Ensino Médio", color: "#156052" }
};
const QTY: Record<string, { label: string; emo: string; color: string }> = {
  ind: { label: "Individual", emo: "🧍", color: "#38B54F" },
  dupla: { label: "Dupla", emo: "🧑‍🤝‍🧑", color: "#F68B21" },
  grupo: { label: "Grupo", emo: "👨‍👩‍👧", color: "#484588" },
  sala: { label: "Sala inteira", emo: "🏫", color: "#156052" }
};

// State variables
let activeSeg = "ALL";
let activeQty = "ALL";
const selected = new Set<string>();
const skillNames: Record<string, string> = {};
let trilhaObjetivo = "";
let currentActiveSlug = "";

// Helper to check segments
function segsOf(p: Prize): string[] {
  return Array.isArray(p.seg) ? p.seg : [p.seg];
}
function qtyOf(p: Prize): string {
  return p.qty ? p.qty : "ind";
}

/* ========================================================
   TABS AND FILTER RENDERING
   ======================================================== */
const tabsEl = document.getElementById("tabs");
function buildTabs() {
  if (!tabsEl) return;
  const defs = [["ALL", "Todos"], ["EI", "EI"], ["EFAI", "EFAI"], ["EFAF", "EFAF"], ["HS", "HS"]];
  tabsEl.innerHTML = "";
  defs.forEach(([v, label]) => {
    const n = v === "ALL" ? LIB.length : LIB.filter(p => segsOf(p).includes(v)).length;
    const b = document.createElement("button");
    b.className = "tab" + (v === activeSeg ? " on" : "");
    b.innerHTML = `${label} <span class="cnt">${n}</span>`;
    b.onclick = () => {
      activeSeg = v;
      buildTabs();
      renderGrid();
    };
    tabsEl.appendChild(b);
  });
}

const grid = document.getElementById("grid");
const qtySelect = document.getElementById("qtySelect") as HTMLSelectElement;
if (qtySelect) {
  qtySelect.onchange = (e) => {
    activeQty = (e.target as HTMLSelectElement).value;
    renderGrid();
  };
}

function renderGrid() {
  if (!grid) return;
  const list = LIB.filter(p => (activeSeg === "ALL" || segsOf(p).includes(activeSeg)) && (activeQty === "ALL" || qtyOf(p) === activeQty));
  grid.innerHTML = "";

  if (!list.length) {
    grid.innerHTML = '<div class="empty">Nada aqui ainda.</div>';
    return;
  }

  list.forEach(p => {
    const el = document.createElement("div");
    el.className = "pcard" + (selected.has(p.id) ? " sel" : "");
    el.innerHTML = `
      <div class="thumb">
        <span class="segpills">${segsOf(p).map(s => `<span style="background:${SEG[s].color}">${s}</span>`).join("")}</span>
        <span class="chk">✓</span>
        ${p.img ? `<img src="${p.img}" alt="">` : `<span class="emo">${p.emo}</span>`}
        <span class="qtypill" style="background:${QTY[qtyOf(p)].color}">${QTY[qtyOf(p)].emo} ${QTY[qtyOf(p)].label}</span>
      </div>
      <div class="b">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="ptsrow">
          <input type="number" min="0" value="${p.pts}" title="Pontos deste prêmio"><span>pts</span>
          <select class="qsel" title="Quantidade de alunos">
            ${Object.keys(QTY).map(k => `<option value="${k}" ${qtyOf(p) === k ? "selected" : ""}>${QTY[k].emo} ${QTY[k].label}</option>`).join("")}
          </select>
        </div>
        <div class="acts">
          <button class="bfoto ${p.img ? 'has' : ''}" title="Adicionar/trocar foto">📷</button>
          <button class="blink ${p.link ? 'has' : ''}" title="Adicionar link do projeto">🔗</button>
          <button class="bfile ${p.file ? 'has' : ''}" title="Adicionar arquivo para download">📎</button>
          ${p.custom ? `<button class="brem" title="Remover prêmio">🗑</button>` : ""}
        </div>
      </div>`;

    el.onclick = (e) => {
      const target = e.target as HTMLElement;
      if (target.closest(".acts") || target.closest(".ptsrow")) return;
      if (selected.has(p.id)) {
        selected.delete(p.id);
      } else {
        selected.add(p.id);
      }
      el.classList.toggle("sel");
      updateCount();
    };

    const inp = el.querySelector(".ptsrow input") as HTMLInputElement;
    inp.onclick = e => e.stopPropagation();
    inp.onchange = () => {
      p.pts = Math.max(0, parseInt(inp.value) || 0);
      inp.value = p.pts.toString();
      saveState();
    };

    const qs = el.querySelector(".qsel") as HTMLSelectElement;
    qs.onclick = e => e.stopPropagation();
    qs.onchange = () => {
      p.qty = qs.value;
      renderGrid();
      saveState();
    };

    (el.querySelector(".bfoto") as HTMLButtonElement).onclick = (e) => {
      e.stopPropagation();
      pickPhoto(p);
    };
    (el.querySelector(".blink") as HTMLButtonElement).onclick = (e) => {
      e.stopPropagation();
      pickLink(p);
    };
    (el.querySelector(".bfile") as HTMLButtonElement).onclick = (e) => {
      e.stopPropagation();
      pickFile(p);
    };

    const rem = el.querySelector(".brem") as HTMLButtonElement;
    if (rem) {
      rem.onclick = (e) => {
        e.stopPropagation();
        if (confirm("Remover este prêmio da biblioteca?")) {
          selected.delete(p.id);
          const i = LIB.indexOf(p);
          if (i >= 0) LIB.splice(i, 1);
          buildTabs();
          renderGrid();
          updateCount();
          saveState();
        }
      };
    }

    grid.appendChild(el);
  });
}

function pickPhoto(p: Prize) {
  const inp = document.createElement("input");
  inp.type = "file";
  inp.accept = "image/*";
  inp.onchange = () => {
    const f = inp.files && inp.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      p.img = r.result as string;
      renderGrid();
      saveState();
    };
    r.readAsDataURL(f);
  };
  inp.click();
}

function pickLink(p: Prize) {
  const url = prompt("Cole o link do projeto (ex.: Thingiverse, Google Drive, YouTube). Deixe em branco para remover:", p.link || "");
  if (url === null) return;
  p.link = url.trim();
  renderGrid();
  saveState();
}

function pickFile(p: Prize) {
  const inp = document.createElement("input");
  inp.type = "file";
  inp.onchange = () => {
    const f = inp.files && inp.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      p.file = { name: f.name, data: r.result as string };
      renderGrid();
      saveState();
    };
    r.readAsDataURL(f);
  };
  inp.click();
}

/* ========================================================
   HELP MODAL
   ======================================================== */
const HELP: Record<string, { title: string; items: { b: string; p: string; ex?: string }[] }> = {
  modo: {
    title: "Modos de premiação",
    items: [
      { b: "🎁 Catálogo por pontos", p: "Os alunos juntam pontos no ClassDojo e escolhem um prêmio do catálogo que você liberou.", ex: "Ex.: “Chaveiro 3D = 40 pontos.” Quem alcançar 40 pontos pode escolher esse prêmio." },
      { b: "🏆 Pódio 1º · 2º · 3º", p: "Sem ficar contando troca por troca: você premia os 3 alunos com mais pontos da turma. Ótimo para quem prefere não mostrar pontos por prêmio.", ex: "Ex.: no fim do mês, os 3 melhores ganham, na ordem, o 1º, o 2º e o 3º prêmio que você escolheu." },
      { b: "🧭 Trilha de habilidades", p: "Cada habilidade que o aluno desenvolve desbloqueia um prêmio diferente, como uma jornada de conquistas.", ex: "Ex.: dominou a impressão 3D → ganha um prêmio; aprendeu a programar → ganha outro." }
    ]
  },
  pontos: {
    title: "Mostrar os pontos",
    items: [
      { b: "Ligado ✅", p: "Cada prêmio aparece com o valor em pontos. Bom para o modo catálogo, quando o aluno acompanha e planeja o que quer alcançar." },
      { b: "Desligado 🚫", p: "Os prêmios aparecem sem número de pontos. Ideal para quem não quer a contabilização (e a ansiedade que ela pode gerar), ou para o modo pódio." }
    ]
  },
  formato: {
    title: "Formato de saída",
    items: [
      { b: "🌐 Site", p: "Gera um link de página web salva no servidor para você abrir no projetor ou compartilhar com a turma." },
      { b: "📄 PDF", p: "Gera um arquivo para imprimir ou enviar. Perfeito para colar no mural da sala de aula." }
    ]
  },
  ident: {
    title: "Por que preencher a identificação",
    items: [
      { b: "🏫 Escola", p: "Diz de qual escola vêm os pedidos, para organizar e entregar a produção certa em cada unidade." },
      { b: "👩‍🏫 Professor(a)", p: "Identifica o responsável pela turma, para os prêmios voltarem para as mãos certas." },
      { b: "🎒 Turma / Segmento", p: "Mostra exatamente para qual turma produzir e ajuda a adequar os prêmios à idade." },
      { b: "🔒 E os dados das crianças?", p: "A criança informa só o nome do ClassDojo — nenhum dado sensível. Tudo fica em uma planilha ou no seu servidor.", ex: "Assim cada pedido chega já identificado: escola, turma, professor e prêmio — e você sabe quantos produzir e para quem." }
    ]
  }
};

const hmodal = document.getElementById("hmodal");
const hmTitle = document.getElementById("hmTitle");
const hmBody = document.getElementById("hmBody");

function openHelp(key: string) {
  const h = HELP[key];
  if (!h || !hmodal || !hmTitle || !hmBody) return;
  hmTitle.textContent = h.title;
  hmBody.innerHTML = h.items.map(it =>
    `<div class="hitem"><b>${it.b}</b><p>${it.p}</p>${it.ex ? `<div class="ex">${it.ex}</div>` : ""}</div>`
  ).join("");
  hmodal.classList.add("show");
}

document.querySelectorAll(".help-ic").forEach(b => {
  b.addEventListener("click", e => {
    e.preventDefault();
    const btn = b as HTMLButtonElement;
    openHelp(btn.dataset.help || "");
  });
});

const hmClose = document.getElementById("hmClose");
if (hmClose) hmClose.onclick = () => hmodal?.classList.remove("show");
if (hmodal) {
  hmodal.onclick = (e) => {
    if (e.target === hmodal) hmodal.classList.remove("show");
  };
}

/* ========================================================
   ADD PRIZE MODAL
   ======================================================== */
const amodal = document.getElementById("amodal");
const amErr = document.getElementById("amErr");
const amName = document.getElementById("amName") as HTMLInputElement;
const amDesc = document.getElementById("amDesc") as HTMLTextAreaElement;
const amPts = document.getElementById("amPts") as HTMLInputElement;
const amEmo = document.getElementById("amEmo") as HTMLInputElement;
const amLink = document.getElementById("amLink") as HTMLInputElement;
const amPhoto = document.getElementById("amPhoto") as HTMLInputElement;
const amFile = document.getElementById("amFile") as HTMLInputElement;
const amQty = document.getElementById("amQty") as HTMLSelectElement;

function openAdd() {
  if (amErr) amErr.style.display = "none";
  if (amName) amName.value = "";
  if (amDesc) amDesc.value = "";
  if (amPts) amPts.value = "30";
  if (amEmo) amEmo.value = "";
  if (amLink) amLink.value = "";
  if (amPhoto) amPhoto.value = "";
  if (amFile) amFile.value = "";
  if (amQty) amQty.value = "ind";
  document.querySelectorAll("#amSegs input").forEach(c => (c as HTMLInputElement).checked = false);
  amodal?.classList.add("show");
}

function closeAdd() {
  amodal?.classList.remove("show");
}

const btnAdd = document.getElementById("btnAdd");
if (btnAdd) btnAdd.onclick = openAdd;

const btnReset = document.getElementById("btnReset");
if (btnReset) btnReset.onclick = resetState;

const amClose = document.getElementById("amClose");
if (amClose) amClose.onclick = closeAdd;

const amCancel = document.getElementById("amCancel");
if (amCancel) amCancel.onclick = closeAdd;

if (amodal) {
  amodal.onclick = (e) => {
    if (e.target === amodal) closeAdd();
  };
}

function readFileInput(inp: HTMLInputElement): Promise<{ name: string; data: string } | null> {
  return new Promise(res => {
    const f = inp.files && inp.files[0];
    if (!f) return res(null);
    const r = new FileReader();
    r.onload = () => res({ name: f.name, data: r.result as string });
    r.readAsDataURL(f);
  });
}

const amSave = document.getElementById("amSave");
if (amSave) {
  amSave.onclick = async () => {
    const name = amName.value.trim();
    const segs = Array.from(document.querySelectorAll("#amSegs input:checked")).map(c => (c as HTMLInputElement).value);

    if (!name || !segs.length) {
      if (amErr) amErr.style.display = "block";
      return;
    }

    const photo = await readFileInput(amPhoto);
    const file = await readFileInput(amFile);

    const p: Prize = {
      id: "custom" + Date.now(),
      seg: segs,
      name: name,
      desc: amDesc.value.trim() || "",
      pts: Math.max(0, parseInt(amPts.value) || 0),
      emo: amEmo.value.trim() || "🎁",
      custom: true,
      qty: amQty.value,
      img: photo ? photo.data : undefined,
      link: amLink.value.trim() || undefined,
      file: file ? { name: file.name, data: file.data } : undefined
    };

    LIB.push(p);
    selected.add(p.id);

    if (activeSeg !== "ALL" && !segs.includes(activeSeg)) activeSeg = "ALL";
    closeAdd();
    buildTabs();
    renderGrid();
    updateCount();
    saveState();
  };
}

/* ========================================================
   SELECTION COUNT AND TRILHA OBJECTIVES
   ======================================================= */
const selCount = document.getElementById("selCount");
const btnGen = document.getElementById("btnGen") as HTMLButtonElement;

function updateCount() {
  const n = selected.size;
  if (selCount) {
    selCount.textContent = n ? `${n} prêmio${n > 1 ? "s" : ""} selecionado${n > 1 ? "s" : ""}` : "Nenhum prêmio selecionado";
  }
  if (btnGen) {
    btnGen.disabled = n === 0;
  }
  renderTrilhaPanel();
}

function currentMode() {
  const checked = document.querySelector('input[name="mode"]:checked') as HTMLInputElement;
  return checked ? checked.value : "loja";
}

function renderTrilhaPanel() {
  const panel = document.getElementById("trilhaPanel");
  if (!panel) return;
  const items = LIB.filter(p => selected.has(p.id));

  if (currentMode() !== "trilha" || !items.length) {
    panel.style.display = "none";
    return;
  }

  panel.style.display = "";
  panel.innerHTML = `
    <h3>🧭 Monte a trilha de habilidades</h3>
    <p class="tp-sub">Defina o objetivo e nomeie a habilidade de cada prêmio. A ordem segue a seleção; o último é o prêmio final. 🏆</p>
    <div class="tp-obj">
      <label>Objetivo da trilha</label>
      <input id="tpObjetivo" value="${(trilhaObjetivo || "").replace(/"/g, '&quot;')}" placeholder="Ex.: Tornar-se um mestre da robótica">
    </div>
    ${items.map((p, i) => `
      <div class="tp-row">
        <span class="tp-n">${i + 1}${i === items.length - 1 ? " 🏆" : ""}</span>
        <span class="tp-emo">${p.img ? "🖼️" : p.emo}</span>
        <span class="tp-name">${p.name}</span>
        <input data-id="${p.id}" value="${(skillNames[p.id] || "").replace(/"/g, '&quot;')}" placeholder="Habilidade (ex.: Dominar impressão 3D)">
      </div>`).join("")}
  `;

  const objI = document.getElementById("tpObjetivo") as HTMLInputElement;
  if (objI) {
    objI.addEventListener("input", () => {
      trilhaObjetivo = objI.value;
      saveState();
    });
  }

  panel.querySelectorAll("input[data-id]").forEach(inp => {
    const inputEl = inp as HTMLInputElement;
    inputEl.addEventListener("input", () => {
      const id = inputEl.dataset.id;
      if (id) {
        skillNames[id] = inputEl.value;
        saveState();
      }
    });
  });
}

// Watch mode radio buttons
document.querySelectorAll('input[name="mode"]').forEach(r => {
  r.addEventListener("change", () => {
    document.querySelectorAll(".mode").forEach(m => {
      const rb = m.querySelector("input") as HTMLInputElement;
      m.classList.toggle("on", rb.checked);
    });
    renderTrilhaPanel();
  });
});

/* ========================================================
   LOCAL STORAGE STATE MANAGEMENT
   ======================================================== */
function saveState() {
  try {
    localStorage.setItem("brino_lib_v1", JSON.stringify(LIB));
    localStorage.setItem("brino_skills_v1", JSON.stringify(skillNames));
    localStorage.setItem("brino_obj_v1", trilhaObjetivo || "");
  } catch (e: any) {
    console.warn("Não foi possível salvar estado:", e.message);
  }
}

function loadState() {
  try {
    const l = localStorage.getItem("brino_lib_v1");
    if (l) {
      const arr = JSON.parse(l);
      if (Array.isArray(arr) && arr.length) {
        LIB.length = 0;
        arr.forEach(x => LIB.push(x));
      }
    }
    const s = localStorage.getItem("brino_skills_v1");
    if (s) {
      Object.assign(skillNames, JSON.parse(s));
    }
    const o = localStorage.getItem("brino_obj_v1");
    if (o !== null) {
      trilhaObjetivo = o;
    }

    const savedSlug = localStorage.getItem("brino_active_slug");
    if (savedSlug) {
      currentActiveSlug = savedSlug;
      showOrdersTabButton();
    }
  } catch (e: any) {
    console.warn("Falha ao carregar salvo:", e.message);
  }
}

function resetState() {
  if (confirm("Restaurar a biblioteca padrão? Isso apaga os prêmios e edições salvos neste navegador.")) {
    try {
      localStorage.removeItem("brino_lib_v1");
      localStorage.removeItem("brino_skills_v1");
      localStorage.removeItem("brino_obj_v1");
      localStorage.removeItem("brino_active_slug");
    } catch (e) {}
    location.reload();
  }
}

/* ========================================================
   SCORING GUIDE (CHART.JS)
   ======================================================== */
let gChart: any = null;

function gv(id: string): number {
  const el = document.getElementById(id) as HTMLInputElement;
  return parseFloat(el?.value || "0");
}

function calcGuide() {
  const aulasSem = Math.max(1, gv("gAulasSem") || 1);
  const semanas = Math.max(1, gv("gSemanas") || 1);
  const ptsAula = Math.max(0, gv("gPtsAula") || 0);
  const eventos = Math.max(1, Math.round(gv("gEventos")) || 1);

  const totalAulas = aulasSem * semanas;
  const totalPts = totalAulas * ptsAula;
  const semanasCiclo = semanas / eventos;
  const ptsCiclo = (totalAulas / eventos) * ptsAula;

  const fTeacher = document.getElementById("fTeacher") as HTMLInputElement;
  const fSchool = document.getElementById("fSchool") as HTMLInputElement;
  const prof = fTeacher?.value.trim() || "";
  const escola = fSchool?.value.trim() || "";
  const who = [prof, escola].filter(Boolean).join(" · ");
  const paramsLine = `${semanas} semanas · ${aulasSem} aula(s)/semana · ${ptsAula} pts por aula · ${eventos} premiação(ões)`;

  const gPrintHead = document.getElementById("gPrintHead");
  if (gPrintHead) {
    gPrintHead.innerHTML = `
      <img src="${LOGO}" alt="Br.ino">
      <div class="ph-txt">
        <h1>Guia de Pontuação</h1>
        ${who ? `<p class="ph-who">${who}</p>` : ""}
        <p class="ph-params">${paramsLine}</p>
      </div>`;
  }

  const cards = [
    ["📅", "Total de aulas", Math.round(totalAulas)],
    ["⭐", "Pontos ao final", Math.round(totalPts)],
    ["🔁", "Cada ciclo dura", semanasCiclo.toFixed(1) + " sem"],
    ["🎯", "Pontos por ciclo", Math.round(ptsCiclo)]
  ];

  const gCards = document.getElementById("gCards");
  if (gCards) {
    gCards.innerHTML = cards.map(r => `
      <div class="gcard">
        <span class="ge">${r[0]}</span>
        <div><b>${r[2]}</b><span>${r[1]}</span></div>
      </div>`).join("");
  }

  const tiers = [["Pequeno", .3], ["Médio", .6], ["Grande (1 ciclo)", 1], ["Épico", 1.5]];
  const gTiers = document.getElementById("gTiers");
  if (gTiers) {
    gTiers.innerHTML = `
      <h4>Sugestão de faixas de pontos para os prêmios</h4>
      <div class="tierrow">
        ${tiers.map(t => `<div class="tier"><span class="tn">${t[0]}</span><span class="tp">${Math.max(1, Math.round(ptsCiclo * (t[1] as number)))} pts</span></div>`).join("")}
      </div>
      <p class="tnote">Um aluno junta ~<b>${Math.round(ptsCiclo)} pontos por ciclo</b> (a cada ${semanasCiclo.toFixed(1)} semanas). Precifique os prêmios em torno disso: pequenos custam pouco e saem toda premiação; os "épicos" exigem juntar mais de um ciclo. Ajuste conforme sua turma.</p>`;
  }

  // Draw chart
  const labels: string[] = [];
  const data: number[] = [];
  for (let w = 0; w <= semanas; w++) {
    labels.push(w === 0 ? "Início" : ("Sem " + w));
    data.push(Math.round(w * aulasSem * ptsAula));
  }

  const evData = labels.map(() => null) as (number | null)[];
  for (let k = 1; k <= eventos; k++) {
    const w = Math.min(semanas, Math.round(semanas * k / eventos));
    evData[w] = Math.round(w * aulasSem * ptsAula);
  }

  if (gChart) gChart.destroy();
  const ChartLib = (window as any).Chart;
  const canvas = document.getElementById("gChart") as HTMLCanvasElement;
  if (canvas && ChartLib) {
    gChart = new ChartLib(canvas, {
      type: "line",
      data: {
        labels,
        datasets: [
          { label: "Pontos acumulados", data, borderColor: "#38B54F", backgroundColor: "rgba(56,181,79,.12)", fill: true, tension: .25, pointRadius: 0 },
          { label: "Dia de premiação", data: evData, borderColor: "#F68B21", backgroundColor: "#F68B21", pointRadius: 6, pointHoverRadius: 8, showLine: false }
        ]
      },
      options: {
        responsive: true,
        aspectRatio: 2,
        plugins: {
          legend: { labels: { font: { family: "Open Sans" }, usePointStyle: true } },
          tooltip: { callbacks: { label: (c: any) => c.dataset.label + ": " + c.parsed.y + " pts" } }
        },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: "Pontos" } },
          x: { ticks: { maxTicksLimit: 10 } }
        }
      }
    });
  }
}

["gAulasSem", "gSemanas", "gPtsAula", "gEventos"].forEach(id => {
  document.getElementById(id)?.addEventListener("input", calcGuide);
});

// Guide PDF print
const gPdf = document.getElementById("gPdf");
if (gPdf) gPdf.onclick = () => window.print();

window.addEventListener("beforeprint", () => {
  if (gChart) {
    gChart.options.aspectRatio = 3.1;
    gChart.resize();
  }
});
window.addEventListener("afterprint", () => {
  if (gChart) {
    gChart.options.aspectRatio = 2;
    gChart.resize();
  }
});

/* ========================================================
   NAVIGATION TABS
   ======================================================== */
document.querySelectorAll(".navbtn").forEach(b => {
  b.addEventListener("click", () => {
    document.querySelectorAll(".navbtn").forEach(x => x.classList.toggle("on", x === b));
    const btn = b as HTMLButtonElement;
    const view = btn.dataset.view;

    const views = ["viewGen", "viewGuide", "viewOrders"];
    views.forEach(v => {
      const el = document.getElementById(v);
      if (el) el.style.display = v.toLowerCase().includes(view || "") ? "" : "none";
    });

    window.scrollTo(0, 0);

    if (view === "guide") {
      setTimeout(calcGuide, 30);
    } else if (view === "orders") {
      fetchOrders();
    }
  });
});

function showOrdersTabButton() {
  const btnNavOrders = document.getElementById("btnNavOrders");
  if (btnNavOrders) btnNavOrders.style.display = "";
}

/* ========================================================
   CATALOG GENERATION & OUTPUT
   ======================================================== */
const overlay = document.getElementById("overlay");
const preview = document.getElementById("preview") as HTMLIFrameElement;
const btnExport = document.getElementById("btnExport") as HTMLButtonElement;
const btnOther = document.getElementById("btnOther") as HTMLButtonElement;
const btnCopyLink = document.getElementById("btnCopyLink") as HTMLButtonElement;
const liveLink = document.getElementById("liveLink") as HTMLAnchorElement;

let currentHTML = "";

function validateIdent(): boolean {
  const ids = ["fTeacher", "fClass", "fSchool"];
  let ok = true;
  let first: HTMLInputElement | undefined;

  ids.forEach(id => {
    const el = document.getElementById(id) as HTMLInputElement | null;
    if (!el) return;

    if (!el.value.trim()) {
      el.classList.add("invalid");
      ok = false;
      if (!first) first = el;
    } else {
      el.classList.remove("invalid");
    }
  });

  const msg = document.getElementById("identMsg");
  if (msg) msg.style.display = ok ? "none" : "block";
  if (first) first.focus();
  return ok;
}

["fTeacher", "fClass", "fSchool"].forEach(id => {
  document.getElementById(id)?.addEventListener("input", function (this: HTMLInputElement) {
    this.classList.remove("invalid");
    const msg = document.getElementById("identMsg");
    if (msg) msg.style.display = "none";
  });
});

function getConfig(): CatalogConfig {
  const fTitle = document.getElementById("fTitle") as HTMLInputElement;
  const fTeacher = document.getElementById("fTeacher") as HTMLInputElement;
  const fClass = document.getElementById("fClass") as HTMLInputElement;
  const fSchool = document.getElementById("fSchool") as HTMLInputElement;
  const fSlug = document.getElementById("fSlug") as HTMLInputElement;
  const showPts = document.getElementById("showPts") as HTMLInputElement;
  const fmtChecked = document.querySelector('input[name="fmt"]:checked') as HTMLInputElement;

  return {
    mode: currentMode(),
    fmt: fmtChecked ? fmtChecked.value : "site",
    showPts: showPts ? showPts.checked : true,
    title: fTitle.value.trim() || "Catálogo de Recompensas",
    teacher: fTeacher.value.trim(),
    klass: fClass.value.trim(),
    school: fSchool.value.trim(),
    slug: fSlug.value.trim() || undefined,
    items: LIB.filter(p => selected.has(p.id)),
    skills: { ...skillNames },
    objetivo: trilhaObjetivo
  };
}

async function openOutput() {
  const fmtChecked = document.querySelector('input[name="fmt"]:checked') as HTMLInputElement;
  const fmt = fmtChecked ? fmtChecked.value : "site";

  if (fmt === "site" && !validateIdent()) return;

  const config = getConfig();

  try {
    const res = await fetch('/api/catalogo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });

    const result = await res.json();
    if (!res.ok) {
      alert(result.error || 'Erro ao gerar catálogo');
      return;
    }

    currentActiveSlug = result.slug;
    localStorage.setItem("brino_active_slug", currentActiveSlug);
    showOrdersTabButton();

    // Fetch dynamic live page HTML
    const livePageUrl = result.url;
    const absoluteUrl = window.location.origin + livePageUrl;

    if (preview) {
      preview.src = livePageUrl;
    }
    if (liveLink) {
      liveLink.href = livePageUrl;
      liveLink.textContent = absoluteUrl;
    }

    // Load dynamic HTML source for downloading standalone file
    const pageRes = await fetch(livePageUrl);
    currentHTML = await pageRes.text();

    const isPdf = config.fmt === "pdf";
    if (btnExport) btnExport.innerHTML = isPdf ? "📄 Salvar como PDF" : "🌐 Baixar site (HTML)";
    if (btnOther) btnOther.innerHTML = isPdf ? "🌐 Baixar site (HTML)" : "📄 Salvar como PDF";

    overlay?.classList.add("show");
  } catch (err) {
    console.error('Error generating:', err);
    alert('Erro de conexão ao servidor.');
  }
}

function download() {
  const b = new Blob([currentHTML], { type: "text/html" });
  const a = document.createElement("a");
  const config = getConfig();
  a.href = URL.createObjectURL(b);
  a.download = (config.title || "catalogo").toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".html";
  a.click();
  URL.revokeObjectURL(a.href);
}

function printPdf() {
  if (!preview || !preview.contentWindow || !preview.contentDocument) return;

  if (typeof (window as any).html2pdf === "function") {
    (window as any).html2pdf()
      .set({
        margin: [0.2, 0.2, 0.2, 0.2],
        filename: "Premiações.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
      })
      .from(preview.contentDocument.body)
      .save();
    return;
  }

  preview.contentWindow.focus();
  preview.contentWindow.print();
}

if (btnExport) {
  btnExport.onclick = () => {
    const config = getConfig();
    config.fmt === "pdf" ? printPdf() : download();
  };
}
if (btnOther) {
  btnOther.onclick = () => {
    const config = getConfig();
    config.fmt === "pdf" ? download() : printPdf();
  };
}
if (btnCopyLink) {
  btnCopyLink.onclick = () => {
    if (liveLink) {
      navigator.clipboard.writeText(liveLink.href);
      const originalText = btnCopyLink.textContent;
      btnCopyLink.textContent = "✅ Copiado!";
      btnCopyLink.style.background = "var(--green-d)";
      setTimeout(() => {
        btnCopyLink.textContent = originalText;
        btnCopyLink.style.background = "";
      }, 2000);
    }
  };
}

const btnClose = document.getElementById("btnClose");
if (btnClose) btnClose.onclick = () => overlay?.classList.remove("show");
if (overlay) {
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.classList.remove("show");
  };
}

if (btnGen) btnGen.onclick = openOutput;

/* ========================================================
   STUDENT ORDERS RETRIEVAL
   ======================================================== */
const tbodyOrders = document.getElementById("tbodyOrders");
const emptyOrders = document.getElementById("emptyOrders");

async function fetchOrders() {
  if (!currentActiveSlug || !tbodyOrders) return;

  try {
    const res = await fetch(`/api/orders/${currentActiveSlug}`);
    const data: Order[] = await res.json();

    tbodyOrders.innerHTML = "";
    if (!data.length) {
      if (emptyOrders) emptyOrders.style.display = "";
      return;
    }

    if (emptyOrders) emptyOrders.style.display = "none";

    data.forEach(ord => {
      const tr = document.createElement("tr");
      tr.style.borderBottom = "1px solid var(--line)";
      
      const dateStr = new Date(ord.timestamp).toLocaleString('pt-BR');
      const detail = ord.skillName ? `🧭 Habilidade: ${ord.skillName}` : "—";
      
      tr.innerHTML = `
        <td style="padding:12px 8px; font-weight:600;">${escapeHtml(ord.studentName)}</td>
        <td style="padding:12px 8px; color:var(--green-d); font-weight:700;">${escapeHtml(ord.prizeName)}</td>
        <td style="padding:12px 8px; color:var(--muted);">${escapeHtml(detail)}</td>
        <td style="padding:12px 8px; font-size:12px; color:var(--muted);">${dateStr}</td>
      `;
      tbodyOrders.appendChild(tr);
    });
  } catch (err) {
    console.error('Error fetching orders:', err);
  }
}

const btnRefreshOrders = document.getElementById("btnRefreshOrders");
if (btnRefreshOrders) btnRefreshOrders.onclick = fetchOrders;

const btnClearOrders = document.getElementById("btnClearOrders");
if (btnClearOrders) {
  btnClearOrders.onclick = async () => {
    if (!currentActiveSlug) return;
    if (confirm("Deseja realmente apagar todos os pedidos recebidos para este catálogo? Esta ação não pode ser desfeita.")) {
      try {
        const res = await fetch(`/api/orders/${currentActiveSlug}`, { method: 'DELETE' });
        if (res.ok) {
          fetchOrders();
        }
      } catch (err) {
        console.error('Error clearing orders:', err);
      }
    }
  };
}

/* ========================================================
   INITIALIZATION
   ======================================================== */
loadState();
buildTabs();
renderGrid();
updateCount();
