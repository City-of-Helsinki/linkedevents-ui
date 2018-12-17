export function mockCurrentTime(mockTime) {
    const RealDate = Date

    class MockDate extends RealDate {
        constructor(values) {
            super()
            if (values) {
                return new RealDate(values)
            } else {
                return new RealDate(mockTime)
            }
        }

        static now() {
            return (new RealDate(mockTime)).getTime()
        }
    }
    global.Date = MockDate
}

export const resetMockDate = () => {
    global.Date = window.Date
}
