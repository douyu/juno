package util

func MaxInt(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func MinInt(a, b int) int {
	if a > b {
		return b
	}

	return a
}

func MinInt64(a, b int64) int64 {
	if a > b {
		return b
	}

	return a
}
