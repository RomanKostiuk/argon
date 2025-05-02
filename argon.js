import argon2 from 'argon2';
import readline from 'readline';
import fs from 'fs';

const шлях = 'password_hash.txt';
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

if (fs.existsSync(шлях)) {
    try {
        fs.chmodSync(шлях, 0o444);
        const хеш = fs.readFileSync(шлях, 'utf8').trim();
        rl.question('Підтвердіть пароль: ', async (ввід) => {
            try {
                console.log(await argon2.verify(хеш, ввід) ? 'Пароль підтверджено!' : 'Помилка: невірний пароль!');
            } catch {
                console.log('Помилка: файл містить недійсний хеш!');
            }
            rl.close();
        });
    } catch (е) {
        console.error('Помилка читання файлу:', е);
        process.exit(1);
    }
} else {
    rl.question('Введіть новий пароль: ', async (п) => {
        rl.question('Підтвердіть пароль: ', async (підтв) => {
            if (п !== підтв) return rl.close(console.log('Помилка: паролі не співпадають!'));
            try {
                const х = await argon2.hash(п);
                fs.writeFileSync(шлях, х);
                fs.chmodSync(шлях, 0o444);
                console.log('Пароль збережено!');
            } catch (е) {
                console.error('Помилка збереження пароля:', е);
            }
            rl.close();
        });
    });
}
