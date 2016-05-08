### VP8
Эмулятор простейшего 8 разрядного процессора, с ассемблером.
Нет макросов, меток, стека, прерываний. Операции ввода/вывода относятся только к памяти для простоты.
Написано на JavaScript с использованием платформы nodejs (https://nodejs.org/).
- Размер слова: 8 бит
- Размер сегмента: 2^8 = 256 байт

### Команды процессора
- 1: NOP: 0x00: без аргументов; простой 
- 2: ADD: 0x01: 1 аргумент; константа, с аккумулятором. Сложение
- 3: SUB: 0x02: 1 аргумент; константа, с аккумулятором. Вычитание
- 4: MUL: 0x03: 1 аргумент; константа, с аккумулятором. Умножение
- 5: DIV: 0x04: 1 аргумент; константа, с аккумулятором. Деление

- 6: INC: 0x05: без аргументов; инкремент значения аккумулятора
- 7: DEC: 0x06: без аргументов; декремент значения аккумулятора

- 8: AND: 0x07: 1 аргумент; константа, с аккумулятором. Логическое И
- 9: XOR: 0x08: 1 аргумент; константа, с аккумулятором. Логическое исключающее ИЛИ
- 10: OR: 0x09: 1 аргумент; константа, с аккумулятором. Логическое ИЛИ
- 11: INV: 0x0A: без аргументов; инверсия значения аккумулятора

- 12: MOV: 0x0B: 2 аргумента; регистры. 1 аргумент - куда пишем значение, 2 аргумент - откуда берём значение
- 13: SET: 0x0C: 1 аргумент: константа, в аккумулятор

- 14: JMP: 0x0D: 1 аргумент; адрес для перехода. Безусловный переход
- 15: JIF: 0x0E: 1 аргумент; адрес для перехода. Переход в зависимости от значения аккумулятора. При значении, отличном от нуля - переход.

- 16: IN: 0x0F: 1 аргумент; адрес. считать значение из памяти в аккумулятор
- 17: OUT: 0x10: 1 аргумент; адрес. записать значение из аккумулятора в память
- 18: INR: 0x11: 1 аргумент; регистр. считать значение из памяти в аккумулятор. Адрес берётся из регистра
- 19: OUTR: 0x12: 1 аргумент; регистр. записать значение из аккумулятора в память. Адрес берётся из регистра

- 20: ADDR: 0x13: 1 аргумент: регистр, со значением аккумулятора
- 21: SUBR: 0x14: 1 аргумент: регистр, со значением аккумулятора
- 22: MULR: 0x15: 1 аргумент: регистр, со значением аккумулятора
- 23: DIVR: 0x16: 1 аргумент: регистр, со значением аккумулятора

- 24: INCR: 0x17: 1 аргумент: регистр, инкремент
- 25: DECR: 0x18: 1 аргумент: регистр, декремент

### Регистры процессора

- ACC - аккумулятор (Accumulator)
- GPR - регистр общего назначения (General Purpose Register)
- PSW - слово состояния программы (Program Status Word)
    * 0x01 - бит исполнения, если установлен то программа исполняется
- CS - сегмент кода (Code Segment)
- DS - сегмент данных (Data Segment)
- IC - счётчик команд (Instruction Counter)
- CI - текущая инструкция (Current Instruction)
- IR - индексный регистр (Index Register)

### ./CLI
Папка cli содержит вспомогательные утилиты
- vp:
    - Первый аргумент - путь к бинарному файлу исполняемой программы.
    - Вывод в stdout.
    - Ошибки в stderr.
- asm:
    - Первый аргумент - путь к ассемблерному файлу.
    - Второй аргумент - путь для создаваемого бинарного файла программы.
    - Логирование в stdout.
    - Ошибки в stderr.

### ./PROGS
Папка progs содержит примеры программ