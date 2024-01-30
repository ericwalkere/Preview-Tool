const clamp = (value, min, max) => {
    if (value < min) return min;
    if (value > max) return max;
    return value;
};

const inRange = (value, min, max) => {
    return value >= min && value <= max;
};

module.exports = {
    clamp,
    inRange,
};
